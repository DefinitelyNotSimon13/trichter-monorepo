package org.trichter.app.features.recording.data

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.emptyFlow
import org.trichter.app.features.recording.domain.LocalMediaRepository
import org.trichter.app.features.recording.domain.models.LocalMedia

/**
 * iOS stub. Mirrors [org.trichter.app.features.ble.data.local.IosLocalRunsRepositoryImpl] —
 * iOS local persistence is not yet implemented (see plan
 * `/home/simon/.claude/plans/i-am-already-uploading-unified-storm.md`).
 */
class IosLocalMediaRepository : LocalMediaRepository {
    override suspend fun insert(media: LocalMedia): Result<Long> = Result.success(-1L)
    override suspend fun getForRun(localRunId: Long): Result<List<LocalMedia>> = Result.success(emptyList())
    override suspend fun delete(id: Long): Result<Unit> = Result.success(Unit)
    override suspend fun updateSyncStatus(
        id: Long,
        syncStatus: String,
        serverId: String?,
        errorMessage: String?,
    ): Result<Unit> = Result.success(Unit)

    override fun observeForRun(localRunId: Long): Flow<List<LocalMedia>> = emptyFlow()
    override fun observeAll(): Flow<List<LocalMedia>> = emptyFlow()
}

actual fun createLocalMediaRepository(): LocalMediaRepository = IosLocalMediaRepository()
