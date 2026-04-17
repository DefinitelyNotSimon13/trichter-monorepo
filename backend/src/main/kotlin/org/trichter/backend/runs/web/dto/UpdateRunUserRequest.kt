package org.trichter.backend.runs.web.dto
import jakarta.validation.constraints.NotBlank

data class UpdateRunUserRequest(
    @field:NotBlank
    val userId: String,
)
