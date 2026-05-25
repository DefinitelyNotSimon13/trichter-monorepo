package org.trichter.app.features.ble.domain.usecases

import org.trichter.app.features.ble.domain.LocalRunsRepository
import org.trichter.app.features.ble.domain.models.LocalRun

class GetLocalRuns(
    private val localRunsRepository: LocalRunsRepository
) {
    suspend operator fun invoke(): Result<List<LocalRun>> {
        return localRunsRepository.getAllRuns()
    }
}

class DeleteLocalRun(
    private val localRunsRepository: LocalRunsRepository
) {
    suspend operator fun invoke(id: Long): Result<Unit> {
        return localRunsRepository.deleteRun(id)
    }
}

class UpdateLocalRunSyncStatus(
    private val localRunsRepository: LocalRunsRepository
) {
    suspend operator fun invoke(
        localRunId: Long,
        syncStatus: String,
        serverId: String? = null,
        errorMessage: String? = null
    ): Result<Unit> {
        return localRunsRepository.updateSyncStatus(localRunId, syncStatus, serverId, errorMessage)
    }
}
