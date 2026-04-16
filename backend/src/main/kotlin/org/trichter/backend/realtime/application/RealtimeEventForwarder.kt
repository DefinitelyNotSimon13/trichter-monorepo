package org.trichter.backend.realtime.application

import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class RealtimeEventForwarder(
    private val outboundWebSocketPublisher: OutboundWebSocketPublisher,
) {
    @TransactionalEventListener(
        phase = TransactionPhase.AFTER_COMMIT,
        fallbackExecution = false,
    )
    fun onRealtimeEvent(event: RealtimeEvent<*>) {
        val envelope = WsEnvelope(
            type = event.type,
            version = event.version,
            occurredAt = event.occurredAt,
            payload = event.payload,
        )

        when (val audience = event.audience) {
            RealtimeAudience.All -> outboundWebSocketPublisher.publishToAll(envelope)
            is RealtimeAudience.User -> outboundWebSocketPublisher.publishToUser(
                userId = audience.userId,
                message = envelope,
            )
        }
    }
}
