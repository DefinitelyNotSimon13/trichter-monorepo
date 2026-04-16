package org.trichter.backend.realtime.application

interface OutboundWebSocketPublisher {
    fun publishToAll(message: Any)
    fun publishToUser(userId: String, message: Any)
}
