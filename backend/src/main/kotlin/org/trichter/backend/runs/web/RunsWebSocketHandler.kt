package org.trichter.backend.runs.web

import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.util.concurrent.ConcurrentHashMap

@Component
class RunsWebSocketHandler : TextWebSocketHandler() {

    private val sessions: MutableSet<WebSocketSession> =
        ConcurrentHashMap.newKeySet()

    override fun afterConnectionEstablished(session: WebSocketSession) {
        sessions.add(session)
    }

    override fun handleTextMessage(
        session: WebSocketSession,
        message: TextMessage
    ) {
        val payload = message.payload

        //TODO: Process and respond
        session.sendMessage(TextMessage("echo: $payload"))
    }

    override fun afterConnectionClosed(
        session: WebSocketSession,
        status: CloseStatus
    ) {
        sessions.remove(session)
    }
}
