package org.trichter.app.features.ble.domain.usecases

import kotlin.time.Clock
import org.trichter.app.features.ble.domain.LocalRunsRepository
import org.trichter.app.features.ble.domain.models.LocalRun
import org.trichter.app.features.ble.domain.models.LocalRunSyncStatus
import org.trichter.app.features.ble.domain.models.ResultMeta

class SaveRunLocally(
    private val localRunsRepository: LocalRunsRepository
) {
    suspend operator fun invoke(
        resultMeta: ResultMeta,
        imageBytes: ByteArray? = null,
        userId: String? = null,
        userDisplayName: String? = null,
    ): Result<Long> {
        val now = Clock.System.now()
        val duplicate = localRunsRepository.getAllRuns().getOrNull()
            ?.firstOrNull()
            ?.takeIf { isDuplicate(it, resultMeta, imageBytes, userId, now) }

        if (duplicate?.id != null) {
            return Result.success(duplicate.id)
        }

        val localRun = LocalRun(
            durationMs = resultMeta.durationMs,
            rateLpm = resultMeta.rateLpm,
            volumeL = resultMeta.volumeL,
            imageData = imageBytes,
            userId = userId,
            userDisplayName = userDisplayName,
            syncStatus = LocalRunSyncStatus.PENDING,
            createdAt = now,
            updatedAt = now
        )
        return localRunsRepository.saveRun(localRun)
    }

    private fun isDuplicate(
        existing: LocalRun,
        resultMeta: ResultMeta,
        imageBytes: ByteArray?,
        userId: String?,
        now: kotlin.time.Instant,
    ): Boolean {
        val timeDeltaMs = now.toEpochMilliseconds() - existing.createdAt.toEpochMilliseconds()
        if (timeDeltaMs > DUPLICATE_WINDOW_MS) return false

        val sameImageSize = (existing.imageData?.size ?: 0) == (imageBytes?.size ?: 0)
        return existing.durationMs == resultMeta.durationMs &&
            existing.rateLpm == resultMeta.rateLpm &&
            existing.volumeL == resultMeta.volumeL &&
            existing.userId == userId &&
            sameImageSize
    }

    private companion object {
        private const val DUPLICATE_WINDOW_MS = 120_000L
    }
}
