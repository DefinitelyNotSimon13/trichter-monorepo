package org.trichter.app.features.auth.domain

import kotlinx.coroutines.flow.StateFlow
import org.trichter.app.features.auth.domain.model.AuthState

interface AuthRepository {
    val authState: StateFlow<AuthState>

    suspend fun initialize()
    suspend fun login()
    suspend fun logout()
}