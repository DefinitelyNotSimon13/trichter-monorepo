package org.trichter.backend.users.usecase

import org.springframework.stereotype.Service
import org.trichter.backend.users.model.UserDto
import org.trichter.backend.users.model.toDto
import org.trichter.backend.users.repository.UserReadRepository
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