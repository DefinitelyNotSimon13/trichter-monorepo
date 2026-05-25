package org.trichter.app.features.ble.domain

import kotlinx.coroutines.flow.Flow
import org.trichter.app.features.ble.domain.models.LocalRun

interface LocalRunsRepository {
    /**
     * Save a new run to local storage
     */
    suspend fun saveRun(run: LocalRun): Result<Long>

    /**
     * Get all local runs
     */
    suspend fun getAllRuns(): Result<List<LocalRun>>

    /**
     * Get a single run by ID
     */
    suspend fun getRun(id: Long): Result<LocalRun?>

    /**
     * Update sync status of a run
     */
    suspend fun updateSyncStatus(
        localRunId: Long,
        syncStatus: String,
        serverId: String? = null,
        errorMessage: String? = null
    ): Result<Unit>

    /**
     * Delete a run by ID
     */
    suspend fun deleteRun(id: Long): Result<Unit>

    /**
     * Get all pending/failed runs for potential retry
     */
    suspend fun getPendingRuns(): Result<List<LocalRun>>

    /**
     * Observe all runs as a flow
     */
    fun observeAllRuns(): Flow<List<LocalRun>>

    /**
     * Update the userId for a local run
     */
    suspend fun updateUserId(localRunId: Long, userId: String?, userDisplayName: String?): Result<Unit>
}
