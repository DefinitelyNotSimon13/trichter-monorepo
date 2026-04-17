package org.trichter.app.features.runs.data.network

import org.trichter.app.features.runs.domain.model.PagedResult
import org.trichter.app.features.runs.domain.model.Run

interface ApiService {
    suspend fun getRuns(page: Int = 0, size: Int = 20): PagedResult<Run>
}
