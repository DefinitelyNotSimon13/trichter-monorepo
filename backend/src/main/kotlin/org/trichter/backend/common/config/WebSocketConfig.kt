package org.trichter.backend.common.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry
import org.trichter.backend.realtime.web.EventsWebSocketHandler

@Configuration
@EnableWebSocket
class BackendWebSocketConfig(
    private val eventsWebSocketHandler: EventsWebSocketHandler,
    @Value("\${app.cors.allowed-origins:*}")
    private val allowedOrigins: String,
) : WebSocketConfigurer {

    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        val origins = allowedOrigins.split(",").map { it.trim() }.filter { it.isNotBlank() }.toTypedArray()
        registry
            .addHandler(eventsWebSocketHandler, "/ws")
            .setAllowedOrigins(*origins)
    }
}
