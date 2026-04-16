package org.trichter.backend.runs.model

import jakarta.validation.constraints.Positive
import java.io.Serializable

data class MeasurementData(
    @field:Positive val rate: Double = 0.0,
    @field:Positive val volume: Double = 0.0,
    @field:Positive val duration: Double = 0.0,
): Serializable
