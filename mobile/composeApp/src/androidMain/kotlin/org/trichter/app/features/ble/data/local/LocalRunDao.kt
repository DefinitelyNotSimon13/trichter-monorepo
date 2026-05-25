package org.trichter.app.features.ble.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface LocalRunDao {
    @Insert
    suspend fun insertRun(run: LocalRunEntity): Long

    @Query("SELECT * FROM local_runs ORDER BY createdAt DESC")
    suspend fun getAllRuns(): List<LocalRunEntity>

    @Query("SELECT * FROM local_runs WHERE id = :id")
    suspend fun getRun(id: Long): LocalRunEntity?

    @Query("SELECT * FROM local_runs WHERE syncStatus IN ('PENDING', 'FAILED') ORDER BY createdAt ASC")
    suspend fun getPendingRuns(): List<LocalRunEntity>

    @Update
    suspend fun updateRun(run: LocalRunEntity)

    @Delete
    suspend fun deleteRun(run: LocalRunEntity)

    @Query("DELETE FROM local_runs WHERE id = :id")
    suspend fun deleteRunById(id: Long)

    @Query("SELECT * FROM local_runs ORDER BY createdAt DESC")
    fun observeAllRuns(): Flow<List<LocalRunEntity>>

    @Query("UPDATE local_runs SET syncStatus = :syncStatus, serverId = :serverId, updatedAt = :updatedAt, errorMessage = :errorMessage WHERE id = :id")
    suspend fun updateSyncStatus(
        id: Long,
        syncStatus: String,
        serverId: String?,
        updatedAt: Long,
        errorMessage: String?
    )

    @Query("UPDATE local_runs SET userId = :userId, userDisplayName = :userDisplayName, updatedAt = :updatedAt WHERE id = :id")
    suspend fun updateUserId(id: Long, userId: String?, userDisplayName: String?, updatedAt: Long)
}
