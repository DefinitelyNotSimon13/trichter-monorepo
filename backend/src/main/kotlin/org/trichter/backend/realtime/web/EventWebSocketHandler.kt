package org.trichter.backend.realtime.web

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import org.trichter.backend.realtime.application.OutboundWebSocketPublisher
import java.util.concurrent.ConcurrentHashMap

@Component
class EventsWebSocketHandler(
    private val objectMapper: ObjectMapper,
) : TextWebSocketHandler(), OutboundWebSocketPublisher {

    private val sessionsByUser =
        ConcurrentHashMap<String, MutableSet<WebSocketSession>>()

    override fun afterConnectionEstablished(session: WebSocketSession) {
        val userId = session.userIdOrNull() ?: run {
            session.close(CloseStatus.NOT_ACCEPTABLE)
            return
        }

        sessionsByUser
            .computeIfAbsent(userId) { ConcurrentHashMap.newKeySet() }
            .add(session)
    }

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        removeSession(session)
    }

    override fun handleTransportError(session: WebSocketSession, exception: Throwable) {
        removeSession(session)
        if (session.isOpen) {
            runCatching { session.close(CloseStatus.SERVER_ERROR) }
        }
    }

    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        // Optional:
        // - app-level ping/pong
        // - subscription commands later
        // - auth refresh or filters if you ever want them
    }

    override fun publishToAll(message: Any) {
        val textMessage = message.toTextMessage()

        sessionsByUser.values
            .asSequence()
            .flatten()
            .filter { it.isOpen }
            .forEach { session ->
                runCatching { session.sendMessage(textMessage) }
                    .onFailure {
                        removeSession(session)
                        if (session.isOpen) {
                            runCatching { session.close(CloseStatus.SERVER_ERROR) }
                        }
                    }
            }
    }

    override fun publishToUser(userId: String, message: Any) {
        val textMessage = message.toTextMessage()

        sessionsByUser[userId]
            ?.filter { it.isOpen }
            ?.forEach { session ->
                runCatching { session.sendMessage(textMessage) }
                    .onFailure {
                        removeSession(session)
                        if (session.isOpen) {
                            runCatching { session.close(CloseStatus.SERVER_ERROR) }
                        }
                    }
            }
    }

    private fun removeSession(session: WebSocketSession) {
        val userId = session.userIdOrNull() ?: return
        sessionsByUser[userId]?.remove(session)
        if (sessionsByUser[userId].isNullOrEmpty()) {
            sessionsByUser.remove(userId)
        }
    }

    private fun WebSocketSession.userIdOrNull(): String? =
        principal?.name

    private fun Any.toTextMessage(): TextMessage =
        TextMessage(objectMapper.writeValueAsString(this))
}
