package org.trichter.backend.realtime.application

import java.time.Instant

interface RealtimeEvent<T : Any> {
    val type: String
    val version: Int get() = 1
    val occurredAt: Instant
    val audience: RealtimeAudience
    val payload: T
}

