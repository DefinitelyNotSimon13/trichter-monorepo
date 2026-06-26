package org.trichter.app.features.recording.domain

import kotlinx.coroutines.flow.Flow
import org.trichter.app.features.recording.domain.models.LocalMedia

interface LocalMediaRepository {
    suspend fun insert(media: LocalMedia): Result<Long>

    suspend fun getForRun(localRunId: Long): Result<List<LocalMedia>>

    suspend fun delete(id: Long): Result<Unit>

    suspend fun updateSyncStatus(
        id: Long,
        syncStatus: String,
        serverId: String? = null,
        errorMessage: String? = null,
    ): Result<Unit>

    fun observeForRun(localRunId: Long): Flow<List<LocalMedia>>

    fun observeAll(): Flow<List<LocalMedia>>
}
