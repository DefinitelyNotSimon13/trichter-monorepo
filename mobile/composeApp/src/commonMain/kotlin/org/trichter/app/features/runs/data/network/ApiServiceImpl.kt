package org.trichter.app.features.runs.data.network

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import org.trichter.app.features.runs.domain.model.PagedResult
import org.trichter.app.features.runs.domain.model.Run

class ApiServiceImpl(private val httpClient: HttpClient) : ApiService {
    private val baseUrl = "https://trichter.hauptspeicher.com/api/v2"

    override suspend fun getRuns(page: Int, size: Int): PagedResult<Run> {
        return httpClient.get("$baseUrl/runs") {
            parameter("page", page)
            parameter("size", size)
        }.body()
    }
}
