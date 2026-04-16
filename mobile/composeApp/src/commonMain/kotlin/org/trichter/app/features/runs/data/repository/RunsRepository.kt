package org.trichter.app.features.runs.data.repository

import org.trichter.app.features.runs.data.model.Run

sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Throwable) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

interface RunsRepository {
    suspend fun getRuns(page: Int = 0, size: Int = 20): Result<Pair<List<Run>, Boolean>>
}
