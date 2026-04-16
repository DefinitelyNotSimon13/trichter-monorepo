package org.trichter.app.features.auth.domain.usecases

import kotlinx.coroutines.flow.StateFlow
import org.trichter.app.features.auth.domain.AuthRepository
import org.trichter.app.features.auth.domain.model.AuthState

class ObserveAuthState(
    private val repository: AuthRepository
) {
    operator fun invoke(): StateFlow<AuthState> = repository.authState
}