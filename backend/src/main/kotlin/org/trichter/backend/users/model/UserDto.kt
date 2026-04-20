package org.trichter.backend.users.model

import java.io.Serializable
import java.time.Instant
import java.time.OffsetDateTime

data class UserDto(
    val id: String = "",
    val createdAt: Instant,
    val username: String,
    val displayUsername: String,
    val image: String? = null,
    val lastActiveAt: OffsetDateTime? = null,
) : Serializable

fun User.toDto() = UserDto(
    id = id,
    createdAt = createdAt,
    username = username,
    displayUsername = displayUsername,
    image = if(image != null && image != "trichter-images/placeholder.jpg") image else null,
    lastActiveAt = lastActiveAt
)
