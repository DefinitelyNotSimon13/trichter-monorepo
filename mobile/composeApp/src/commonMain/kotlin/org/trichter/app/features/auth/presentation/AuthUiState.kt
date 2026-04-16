package org.trichter.app.features.auth.presentation

sealed interface AuthUiState {
    data object Initializing : AuthUiState
    data object Unauthenticated : AuthUiState
    data object Authenticating : AuthUiState
    data object Authenticated : AuthUiState
    data class Error(val message: String) : AuthUiState
}