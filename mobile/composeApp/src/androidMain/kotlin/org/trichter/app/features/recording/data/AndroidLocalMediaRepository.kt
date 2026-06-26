package org.trichter.app.features.recording.data

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.trichter.app.features.recording.domain.LocalMediaRepository
import org.trichter.app.features.recording.domain.models.LocalMedia
import org.trichter.app.features.recording.domain.models.LocalMediaKind
import org.trichter.app.features.recording.domain.models.LocalMediaSyncStatus
import kotlin.time.Instant

class AndroidLocalMediaRepository(
    private val dao: LocalMediaDao,
) : LocalMediaRepository {

    override suspend fun insert(media: LocalMedia): Result<Long> = try {
        Result.success(dao.insert(media.toEntity()))
    } catch (e: Exception) {
        Result.failure(e)
    }

    override suspend fun getForRun(localRunId: Long): Result<List<LocalMedia>> = try {
        Result.success(dao.getForRun(localRunId).map { it.toDomain() })
    } catch (e: Exception) {
        Result.failure(e)
    }

    override suspend fun delete(id: Long): Result<Unit> = try {
        dao.delete(id)
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e)
    }

    override suspend fun updateSyncStatus(
        id: Long,
        syncStatus: String,
        serverId: String?,
        errorMessage: String?,
    ): Result<Unit> = try {
        dao.updateSyncStatus(id, syncStatus, serverId, errorMessage, System.currentTimeMillis())
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e)
    }

    override fun observeForRun(localRunId: Long): Flow<List<LocalMedia>> =
        dao.observeForRun(localRunId).map { list -> list.map { it.toDomain() } }

    override fun observeAll(): Flow<List<LocalMedia>> =
        dao.observeAll().map { list -> list.map { it.toDomain() } }

    private fun LocalMediaEntity.toDomain() = LocalMedia(
        id = id,
        localRunId = localRunId,
        kind = LocalMediaKind.valueOf(kind),
        filePath = filePath,
        contentType = contentType,
        durationMs = durationMs,
        width = width,
        height = height,
        syncStatus = LocalMediaSyncStatus.valueOf(syncStatus),
        serverId = serverId,
        errorMessage = errorMessage,
        createdAt = Instant.fromEpochMilliseconds(createdAt),
        updatedAt = Instant.fromEpochMilliseconds(updatedAt),
    )

    private fun LocalMedia.toEntity() = LocalMediaEntity(
        id = id ?: 0,
        localRunId = localRunId,
        kind = kind.name,
        filePath = filePath,
        contentType = contentType,
        durationMs = durationMs,
        width = width,
        height = height,
        syncStatus = syncStatus.name,
        serverId = serverId,
        errorMessage = errorMessage,
        createdAt = createdAt.toEpochMilliseconds(),
        updatedAt = updatedAt.toEpochMilliseconds(),
    )
}
