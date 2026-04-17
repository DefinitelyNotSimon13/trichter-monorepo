package org.trichter.app.features.runs.data.repository

import org.trichter.api.client.apis.RunsApi
import org.trichter.api.client.models.RunDto
import kotlin.let

class RunsRepositoryImpl(private val runsApi: RunsApi) : RunsRepository {
    override suspend fun getRuns(page: Int, size: Int): Result<Pair<List<RunDto>, Boolean>> {
        return try {
            val paged = runsApi.getRuns(page, size).body()
            val hasMore =
                paged.page?.let { (it.number?.plus(1) ?: 0) < (it.totalPages ?: 0) } ?: false
            Result.Success((paged.content ?: listOf()) to hasMore)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }
}
