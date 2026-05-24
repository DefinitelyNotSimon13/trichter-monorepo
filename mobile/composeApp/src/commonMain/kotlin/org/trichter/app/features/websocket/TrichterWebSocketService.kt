package org.trichter.app.features.websocket

import io.ktor.client.HttpClient
import io.ktor.client.plugins.websocket.webSocket
import io.ktor.http.HttpHeaders
import io.ktor.websocket.Frame
import io.ktor.websocket.readText
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.filterIsInstance
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import org.trichter.app.di.ApiConfig
import org.trichter.app.features.auth.domain.AuthRepository
import org.trichter.app.features.auth.domain.model.AuthState
import org.trichter.app.util.Log

sealed class RunWsEvent {
    data class RunCreated(val runId: String, val userId: String?) : RunWsEvent()
    data class RunImageUploaded(val runId: String, val imageUrl: String) : RunWsEvent()
}

interface TrichterWebSocketService {
    val events: SharedFlow<RunWsEvent>
}

class TrichterWebSocketServiceImpl(
    private val httpClient: HttpClient,
    private val config: ApiConfig,
    private val authRepository: AuthRepository,
) : TrichterWebSocketService {

    private val _events = MutableSharedFlow<RunWsEvent>(extraBufferCapacity = 64)
    override val events: SharedFlow<RunWsEvent> = _events.asSharedFlow()

    private val serviceScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private val json = Json { ignoreUnknownKeys = true; isLenient = true }

    init {
        serviceScope.launch {
//            authRepository.authState
//                .filterIsInstance<AuthState.Authenticated>()
//                .collectLatest { auth ->
//                    connectWithBackoff(auth.session.accessToken)
//                }
        }
    }

    private suspend fun connectWithBackoff(token: String) {
        val backoffDelays = longArrayOf(2_000, 5_000, 10_000, 30_000)
        var attempt = 0
        while (true) {
            try {
                Log.i("WS", "Connecting (attempt $attempt)")
                connectSession(token)
                attempt = 0
            } catch (e: CancellationException) {
                throw e
            } catch (e: Exception) {
                val delayMs = backoffDelays[minOf(attempt, backoffDelays.size - 1)]
                Log.e("WS", "Connection failed, retry in ${delayMs}ms: ${e.message}")
                delay(delayMs)
                attempt++
            }
        }
    }

    private suspend fun connectSession(token: String) {
        val wsUrl = config.baseUrl
            .replace("https://", "wss://")
            .replace("http://", "ws://")
            .trimEnd('/') + "/api/v2/ws"

        Log.i("WS", "WS URL: $wsUrl")


        httpClient.webSocket(
            urlString = wsUrl,
            request = { headers.append(HttpHeaders.Authorization, "Bearer $token") }
        ) {
            Log.i("WS", "Connected to $wsUrl")
            val pingJob = launch {
                while (true) {
                    delay(25_000)
                    send(Frame.Text("""{"type":"ping"}"""))
                }
            }
            try {
                for (frame in incoming) {
                    if (frame is Frame.Text) handleMessage(frame.readText())
                }
            } finally {
                pingJob.cancel()
                Log.i("WS", "Session ended")
            }
        }
    }

    private fun handleMessage(text: String) {
        try {
            val obj = json.parseToJsonElement(text).jsonObject
            when (obj["type"]?.jsonPrimitive?.content) {
                "event" -> handleEvent(obj)
                "pong" -> Log.i("WS", "Pong received")
            }
        } catch (e: Exception) {
            Log.e("WS", "Failed to parse message: ${e.message}")
        }
    }

    private fun handleEvent(obj: JsonObject) {
        val payload = obj["payload"]?.jsonObject ?: return
        when (obj["eventType"]?.jsonPrimitive?.content) {
            "run.created" -> {
                val runId = payload["runId"]?.jsonPrimitive?.content ?: return
                val userId = payload["userId"]?.let { if (it is JsonNull) null else it.jsonPrimitive.content }
                serviceScope.launch { _events.emit(RunWsEvent.RunCreated(runId, userId)) }
            }
            "run.image-uploaded" -> {
                val runId = payload["runId"]?.jsonPrimitive?.content ?: return
                val imageUrl = payload["imageUrl"]?.jsonPrimitive?.content ?: return
                serviceScope.launch { _events.emit(RunWsEvent.RunImageUploaded(runId, imageUrl)) }
            }
        }
    }
}
