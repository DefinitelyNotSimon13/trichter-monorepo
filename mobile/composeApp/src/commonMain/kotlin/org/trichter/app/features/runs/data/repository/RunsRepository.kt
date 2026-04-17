package org.trichter.app.features.runs.data.repository

import org.trichter.api.client.models.RunDto


sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Throwable) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

public inline fun <T, R> Result<T>.map(transform: (T) -> R): Result<R> {
    return when (this) {
        is Result.Success -> Result.Success(transform(data))
        is Result.Error -> this
        Result.Loading -> Result.Loading
    }
}

interface RunsRepository {
    suspend fun getRuns(page: Int = 0, size: Int = 20): Result<Pair<List<RunDto>, Boolean>>
}
