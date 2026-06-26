package org.trichter.app.features.recording.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface LocalMediaDao {
    @Insert
    suspend fun insert(media: LocalMediaEntity): Long

    @Query("SELECT * FROM local_media WHERE localRunId = :runId ORDER BY createdAt ASC")
    suspend fun getForRun(runId: Long): List<LocalMediaEntity>

    @Query("SELECT * FROM local_media WHERE localRunId = :runId ORDER BY createdAt ASC")
    fun observeForRun(runId: Long): Flow<List<LocalMediaEntity>>

    @Query("SELECT * FROM local_media ORDER BY createdAt DESC")
    fun observeAll(): Flow<List<LocalMediaEntity>>

    @Query("DELETE FROM local_media WHERE id = :id")
    suspend fun delete(id: Long)

    @Query("UPDATE local_media SET syncStatus = :syncStatus, serverId = :serverId, errorMessage = :errorMessage, updatedAt = :updatedAt WHERE id = :id")
    suspend fun updateSyncStatus(
        id: Long,
        syncStatus: String,
        serverId: String?,
        errorMessage: String?,
        updatedAt: Long,
    )
}
