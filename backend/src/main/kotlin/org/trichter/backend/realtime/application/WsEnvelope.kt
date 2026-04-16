package org.trichter.backend.realtime.application

import java.time.Instant

data class WsEnvelope(
    val type: String,
    val version: Int,
    val occurredAt: Instant,
    val payload: Any,
)