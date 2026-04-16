package org.trichter.app.features.runs.data.repository

import org.trichter.app.features.runs.data.model.Run
import org.trichter.app.features.runs.data.network.ApiService

class RunsRepositoryImpl(private val apiService: ApiService) : RunsRepository {
    override suspend fun getRuns(page: Int, size: Int): Result<Pair<List<Run>, Boolean>> {
        return try {
            val paged = apiService.getRuns(page, size)
            val hasMore = paged.page?.let { it.number + 1 < it.totalPages } ?: false
            Result.Success(paged.content to hasMore)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }
}
