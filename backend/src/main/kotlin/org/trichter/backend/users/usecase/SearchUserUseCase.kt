package org.trichter.backend.users.usecase

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.trichter.backend.users.model.UserDto
import org.trichter.backend.users.model.toDto
import org.trichter.backend.users.repository.UserReadRepository

@Service
class SearchUserUseCase(
    private val userReadRepository: UserReadRepository
) {
    operator fun invoke(query: String, pageable: Pageable): Page<UserDto> {
        return userReadRepository
            .findByUsernameContainingIgnoreCaseOrDisplayUsernameContainingIgnoreCase(
                query,
                query,
                pageable
            ).map { it.toDto() }
    }
}