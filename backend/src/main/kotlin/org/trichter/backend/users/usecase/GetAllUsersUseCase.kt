package org.trichter.backend.users.usecase

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.trichter.backend.users.model.UserDto
import org.trichter.backend.users.model.toDto
import org.trichter.backend.users.repository.UserReadRepository

@Service
class GetAllUsersUseCase(
    private val userReadRepository: UserReadRepository
) {
    operator fun invoke(pageable: Pageable): Page<UserDto> {
        return userReadRepository.findAll(pageable).map { it.toDto() }
    }
}