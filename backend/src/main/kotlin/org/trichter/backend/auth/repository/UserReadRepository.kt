package org.trichter.backend.auth.repository

import org.springframework.data.repository.Repository
import org.trichter.backend.auth.model.User
import java.util.Optional
import java.util.UUID

interface UserReadRepository : Repository<User, String> {
    fun findById(id: String): Optional<User>
    fun existsById(id: String): Boolean
}
