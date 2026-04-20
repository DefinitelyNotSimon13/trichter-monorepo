package org.trichter.backend.runs.model

import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Past
import jakarta.validation.constraints.Positive
import org.trichter.backend.auth.model.UserDto
import org.trichter.backend.auth.model.toDto
import java.io.Serializable
import java.time.OffsetDateTime
import java.util.*

/**
 * DTO for {@link org.trichter.backend.runs.model.Run}
 */
data class RunDto(
    val id: UUID,
    val user: UserDto? = null,
    @field:Positive val rate: Double,
    @field:Positive val volume: Double,
    @field:Positive val duration: Double,
    val image: String? = null,
    @field:NotNull @field:Past var createdAt: OffsetDateTime
) : Serializable

fun Run.toDto() = RunDto(
    id = requireNotNull(this.id),
    user = user?.toDto(),
    rate = rate,
    volume = volume,
    duration = duration,
    image = if(image != null && image != "trichter-images/placeholder.jpg") image else null,
    createdAt = createdAt
)