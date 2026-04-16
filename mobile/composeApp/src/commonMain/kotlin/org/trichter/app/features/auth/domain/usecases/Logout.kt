package org.trichter.app.features.auth.domain.usecases

import org.trichter.app.features.auth.domain.AuthRepository

class Logout(
    private val repository: AuthRepository
) {
    suspend operator fun invoke() = repository.logout()
}