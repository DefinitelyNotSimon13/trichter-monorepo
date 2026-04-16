package org.trichter.backend.realtime.application

sealed interface RealtimeAudience {
    data object All : RealtimeAudience
    data class User(val userId: String) : RealtimeAudience
}
