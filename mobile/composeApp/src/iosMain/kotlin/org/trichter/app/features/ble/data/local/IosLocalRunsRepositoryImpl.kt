package org.trichter.app.features.ble.data.local

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.emptyFlow
import org.trichter.app.features.ble.domain.LocalRunsRepository
import org.trichter.app.features.ble.domain.models.LocalRun

/**
 * iOS stub implementation for LocalRunsRepository.
 * TODO: Implement with SQLite or CoreData when needed.
 */
class IosLocalRunsRepositoryImpl : LocalRunsRepository {

    override suspend fun saveRun(run: LocalRun): Result<Long> {
        // TODO: Implement iOS database storage
        return Result.success(-1)
    }

    override suspend fun getAllRuns(): Result<List<LocalRun>> {
        // TODO: Implement iOS database retrieval
        return Result.success(emptyList())
    }

    override suspend fun getRun(id: Long): Result<LocalRun?> {
        // TODO: Implement iOS database retrieval
        return Result.success(null)
    }

    override suspend fun updateSyncStatus(
        localRunId: Long,
        syncStatus: String,
        serverId: String?,
        errorMessage: String?
    ): Result<Unit> {
        // TODO: Implement iOS database update
        return Result.success(Unit)
    }

    override suspend fun deleteRun(id: Long): Result<Unit> {
        // TODO: Implement iOS database deletion
        return Result.success(Unit)
    }

    override suspend fun getPendingRuns(): Result<List<LocalRun>> {
        // TODO: Implement iOS database retrieval
        return Result.success(emptyList())
    }

    override fun observeAllRuns(): Flow<List<LocalRun>> {
        // TODO: Implement iOS database observation
        return emptyFlow()
    }

    override suspend fun updateUserId(localRunId: Long, userId: String?, userDisplayName: String?): Result<Unit> {
        // TODO: Implement iOS database update
        return Result.success(Unit)
    }
}
