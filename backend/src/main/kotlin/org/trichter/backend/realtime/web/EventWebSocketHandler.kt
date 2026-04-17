package org.trichter.backend.realtime.web

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import org.trichter.backend.realtime.application.OutboundWebSocketPublisher
import java.time.Duration
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap

@Component
class EventsWebSocketHandler(
    private val objectMapper: ObjectMapper,
) : TextWebSocketHandler(), OutboundWebSocketPublisher {

    private val log = LoggerFactory.getLogger(javaClass)

    private val sessions = ConcurrentHashMap<String, SessionState>()

    private val staleAfter: Duration = Duration.ofSeconds(70) //TODO: Make configurable?

    override fun afterConnectionEstablished(session: WebSocketSession) {
        sessions[session.id] = SessionState(
            session = session,
            lastSeenAt = Instant.now(),
        )
        log.info("WebSocket session {} established", session.id)
    }

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        removeSession(session)
        log.info("WebSocket session {} closed with status {}", session.id, status)
    }

    override fun handleTransportError(session: WebSocketSession, exception: Throwable) {
        removeSession(session)
        log.error("Transport error for WebSocket session {}", session.id, exception)
        if (session.isOpen) {
            runCatching { session.close(CloseStatus.SERVER_ERROR) }
        }
    }

    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        val state = sessions[session.id] ?: return
        state.lastSeenAt = Instant.now()

        val root = runCatching { objectMapper.readTree(message.payload) }
            .getOrElse {
                log.warn("Ignoring invalid JSON from session {}", session.id)
                return
            }

        when (root["type"]?.asText()) {
            "ping" -> {
                sendToSession(
                    session,
                    mapOf(
                        "type" to "pong",
                        "ts" to Instant.now().toString(),
                    )
                )
            }
            else -> {
                log.debug("Ignoring unsupported client message from session {}: {}", session.id, message.payload)
            }
        }
    }

    override fun publishToAll(message: Any) {
        sessions.values
            .asSequence()
            .map { it.session }
            .filter { it.isOpen }
            .forEach { session -> sendToSession(session, message) }
    }

    override fun publishToUser(userId: String, message: Any) {
        sessions.values
            .asSequence()
            .map { it.session }
            .filter { it.isOpen }
            .filter { it.userIdOrNull() == userId }
            .forEach { session -> sendToSession(session, message) }
    }

    @Scheduled(fixedRate = 15000)
    fun evictStaleSessions() {
        log.debug("Evicting stale WebSocket sessions")
        val cutoff = Instant.now().minus(staleAfter)

        sessions.values.forEach { state ->
            if (state.lastSeenAt.isBefore(cutoff)) {
                log.warn("Closing stale WebSocket session {}", state.session.id)
                removeSession(state.session)
                if (state.session.isOpen) {
                    runCatching {
                        state.session.close(CloseStatus.SESSION_NOT_RELIABLE)
                    }
                }
            }
        }
    }

    private fun sendToSession(session: WebSocketSession, message: Any) {
        val textMessage = TextMessage(objectMapper.writeValueAsString(message))

        runCatching { session.sendMessage(textMessage) }
            .onFailure { ex ->
                log.warn("Failed to send to session {}", session.id, ex)
                removeSession(session)
                if (session.isOpen) {
                    runCatching { session.close(CloseStatus.SERVER_ERROR) }
                }
            }
    }

    private fun removeSession(session: WebSocketSession) {
        sessions.remove(session.id)
    }

    private fun WebSocketSession.userIdOrNull(): String? =
        principal?.name

    private data class SessionState(
        val session: WebSocketSession,
        @Volatile var lastSeenAt: Instant,
    )
}
