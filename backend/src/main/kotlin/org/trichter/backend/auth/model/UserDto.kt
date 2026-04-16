package org.trichter.backend.auth.model

import jakarta.validation.constraints.NotNull
import java.io.Serializable
import java.time.Instant
import java.time.OffsetDateTime

/**
 * DTO for {@link org.trichter.backend.auth.model.User}
 */
data class UserDto(
    val id: String = "",
    @field:NotNull var createdAt: Instant,
    @field:NotNull var username: String,
    @field:NotNull var displayUsername: String,
    val lastActiveAt: OffsetDateTime? = null
) : Serializable

fun User.toDto() = UserDto(
    id = id,
    createdAt = createdAt,
    username = username,
    displayUsername = displayUsername,
    lastActiveAt = lastActiveAt
)