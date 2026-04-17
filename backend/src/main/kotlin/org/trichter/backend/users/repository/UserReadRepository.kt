package org.trichter.backend.users.repository

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.Repository
import org.trichter.backend.users.model.User
import java.util.Optional

interface UserReadRepository : Repository<User, String> {
    fun findByUsernameContainingIgnoreCaseOrDisplayUsernameContainingIgnoreCase(
        usernameQuery: String,
        displayUsernameQuery: String,
        pageable: Pageable
    ): Page<User>
    fun findAll(pageable: Pageable): Page<User>
    fun findById(id: String): Optional<User>
    fun existsById(id: String): Boolean
}
