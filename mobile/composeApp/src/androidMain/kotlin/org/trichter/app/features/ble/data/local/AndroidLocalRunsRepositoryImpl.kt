package org.trichter.app.features.ble.data.local

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlin.time.Instant
import org.trichter.app.features.ble.domain.LocalRunsRepository
import org.trichter.app.features.ble.domain.models.LocalRun
import org.trichter.app.features.ble.domain.models.LocalRunSyncStatus

class AndroidLocalRunsRepositoryImpl(
    private val dao: LocalRunDao
) : LocalRunsRepository {

    override suspend fun saveRun(run: LocalRun): Result<Long> = try {
        val entity = run.toEntity()
        val id = dao.insertRun(entity)
        Result.success(id)
    } catch (e: Exception) {
        Result.failure(e)
    }

    override suspend fun getAllRuns(): Result<List<LocalRun>> = try {
        val entities = dao.getAllRuns()
        Result.success(entities.map { it.toDomain() })
    } catch (e: Exception) {
        Result.failure(e)
    }

    override suspend fun getRun(id: Long): Result<LocalRun?> = try {
        val entity = dao.getRun(id)
        Result.success(entity?.toDomain())
    } catch (e: Exception) {
        Result.failure(e)
    }

    override suspend fun updateSyncStatus(
        localRunId: Long,
        syncStatus: String,
        serverId: String?,
        errorMessage: String?
    ): Result<Unit> = try {
        val now = System.currentTimeMillis()
        dao.updateSyncStatus(localRunId, syncStatus, serverId, now, errorMessage)
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e)
    }

    override suspend fun updateUserId(localRunId: Long, userId: String?, userDisplayName: String?): Result<Unit> = try {
        val now = System.currentTimeMillis()
        dao.updateUserId(localRunId, userId, userDisplayName, now)
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e)
    }

    override suspend fun deleteRun(id: Long): Result<Unit> = try {
        dao.deleteRunById(id)
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e)
    }

    override suspend fun getPendingRuns(): Result<List<LocalRun>> = try {
        val entities = dao.getPendingRuns()
        Result.success(entities.map { it.toDomain() })
    } catch (e: Exception) {
        Result.failure(e)
    }

    override fun observeAllRuns(): Flow<List<LocalRun>> {
        return dao.observeAllRuns().map { entities ->
            entities.map { it.toDomain() }
        }
    }

    private fun LocalRunEntity.toDomain(): LocalRun {
        return LocalRun(
            id = id,
            durationMs = durationMs,
            rateLpm = rateLpm,
            volumeL = volumeL,
            imageData = imageData,
            userId = userId,
            userDisplayName = userDisplayName,
            syncStatus = LocalRunSyncStatus.valueOf(syncStatus),
            serverId = serverId,
            createdAt = Instant.fromEpochMilliseconds(createdAt),
            updatedAt = Instant.fromEpochMilliseconds(updatedAt),
            errorMessage = errorMessage
        )
    }

    private fun LocalRun.toEntity(): LocalRunEntity {
        return LocalRunEntity(
            id = id ?: 0,
            durationMs = durationMs,
            rateLpm = rateLpm,
            volumeL = volumeL,
            imageData = imageData,
            userId = userId,
            userDisplayName = userDisplayName,
            syncStatus = syncStatus.name,
            serverId = serverId,
            createdAt = createdAt.toEpochMilliseconds(),
            updatedAt = updatedAt.toEpochMilliseconds(),
            errorMessage = errorMessage
        )
    }
}
