package org.trichter.app.features.auth.domain.model

sealed interface AuthState {
    data object Initializing: AuthState
    data object Unauthenticated: AuthState
    data object Authenticating: AuthState
    data class Authenticated(val session: AuthSession): AuthState
    data class Error(val message: String): AuthState
}