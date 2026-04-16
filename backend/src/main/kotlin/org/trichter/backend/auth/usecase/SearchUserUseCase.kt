package org.trichter.backend.auth.usecase

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.trichter.backend.auth.model.UserDto
import org.trichter.backend.auth.model.toDto
import org.trichter.backend.auth.repository.UserReadRepository

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