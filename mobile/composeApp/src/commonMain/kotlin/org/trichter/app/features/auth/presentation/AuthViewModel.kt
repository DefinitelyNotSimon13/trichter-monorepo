package org.trichter.app.features.auth.presentation


import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.trichter.app.features.auth.domain.model.AuthState
import org.trichter.app.features.auth.domain.usecases.InitializeAuth
import org.trichter.app.features.auth.domain.usecases.Login
import org.trichter.app.features.auth.domain.usecases.Logout
import org.trichter.app.features.auth.domain.usecases.ObserveAuthState
import org.trichter.app.util.Log

class AuthViewModel(
    observeAuthState: ObserveAuthState,
    private val initializeAuthUseCase: InitializeAuth,
    private val loginUseCase: Login,
    private val logoutUseCase: Logout,
) : ViewModel() {

    val loggedInAgain: MutableStateFlow<Boolean> = MutableStateFlow(false)

    val uiState: StateFlow<AuthUiState> = observeAuthState()
        .map { state ->
            when (state) {
                AuthState.Initializing -> AuthUiState.Initializing
                AuthState.Unauthenticated -> AuthUiState.Unauthenticated
                AuthState.Authenticating -> AuthUiState.Authenticating
                is AuthState.Authenticated -> AuthUiState.Authenticated
                is AuthState.Error -> {
                    if(state.message == "No auth code" && !loggedInAgain.value) {
                        loggedInAgain.update { true }
                        viewModelScope.launch {
                            login()
                        }
                        return@map AuthUiState.Authenticating
                    } else {

                        AuthUiState.Error(state.message)
                    }
                }
            }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = AuthUiState.Initializing,
        )

    init {
        viewModelScope.launch {
            initializeAuthUseCase()
        }
    }

    fun login() {
        viewModelScope.launch {
            loginUseCase()
        }
    }

    fun retry() {
        viewModelScope.launch {
            initializeAuthUseCase()
        }
    }

    fun logout() {
        viewModelScope.launch {
            logoutUseCase()
        }
    }
}