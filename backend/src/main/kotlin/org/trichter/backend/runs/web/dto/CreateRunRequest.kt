package org.trichter.backend.runs.web.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.PositiveOrZero

data class CreateRunRequest(
    val userId: String,

    @field:PositiveOrZero
    val duration: Double,

    @field:PositiveOrZero
    val rate: Double,

    @field:PositiveOrZero
    val volume: Double,

)