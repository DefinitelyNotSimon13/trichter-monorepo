package org.trichter.app.features.auth.domain.usecases

import org.trichter.app.features.auth.domain.AuthRepository

class InitializeAuth(
    private val repository: AuthRepository
) {
    suspend operator fun invoke() = repository.initialize()
}