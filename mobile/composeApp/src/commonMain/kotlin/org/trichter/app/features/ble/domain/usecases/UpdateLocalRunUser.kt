package org.trichter.app.features.ble.domain.usecases

import org.trichter.app.features.ble.domain.LocalRunsRepository

class UpdateLocalRunUser(
    private val localRunsRepository: LocalRunsRepository
) {
    suspend operator fun invoke(
        localRunId: Long,
        userId: String?,
        userDisplayName: String?,
    ): Result<Unit> {
        return localRunsRepository.updateUserId(localRunId, userId, userDisplayName)
    }
}
