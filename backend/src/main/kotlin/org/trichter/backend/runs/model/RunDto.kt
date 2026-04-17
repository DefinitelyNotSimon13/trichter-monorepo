package org.trichter.backend.runs.model

import jakarta.validation.constraints.Positive
import org.trichter.backend.users.model.UserDto
import org.trichter.backend.users.model.toDto
import java.io.Serializable
import java.time.OffsetDateTime
import java.util.*

data class RunDto(
    val id: UUID,
    val user: UserDto? = null,
    val createdBy: UserDto? = null,
    @field:Positive val rate: Double,
    @field:Positive val volume: Double,
    @field:Positive val duration: Double,
    val image: String? = null,
    val createdAt: OffsetDateTime,
) : Serializable

fun Run.toDto() = RunDto(
    id = requireNotNull(this.id),
    user = user?.toDto(),
    createdBy = createdBy?.toDto(),
    rate = rate,
    volume = volume,
    duration = duration,
    image = if(image != null && image != "trichter-images/placeholder.jpg") image else null,
    createdAt = createdAt
)
