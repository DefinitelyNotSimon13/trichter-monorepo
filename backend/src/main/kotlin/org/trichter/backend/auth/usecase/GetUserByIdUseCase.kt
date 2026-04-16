package org.trichter.backend.auth.usecase

import org.springframework.stereotype.Service
import org.trichter.backend.auth.model.UserDto
import org.trichter.backend.auth.model.toDto
import org.trichter.backend.auth.repository.UserReadRepository
import org.trichter.backend.common.errors.NotFoundException

@Service
class GetUserByIdUseCase(
    private val userReadRepository: UserReadRepository
) {
    operator fun invoke(userId: String): UserDto {
        val user = userReadRepository.findById(userId)
            .orElseThrow { NotFoundException("User $userId not found") }

        return user.toDto()
    }
}