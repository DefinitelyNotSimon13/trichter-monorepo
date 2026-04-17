package org.trichter.backend.users.model

import java.io.Serializable
import java.time.Instant
import java.time.OffsetDateTime

data class UserDto(
    val id: String = "",
    val createdAt: Instant,
    val username: String,
    val displayUsername: String,
    val lastActiveAt: OffsetDateTime? = null,
) : Serializable

fun User.toDto() = UserDto(
    id = id,
    createdAt = createdAt,
    username = username,
    displayUsername = displayUsername,
    lastActiveAt = lastActiveAt
)
