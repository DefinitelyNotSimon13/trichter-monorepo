package org.trichter.app.features.recording.domain.usecases

import kotlin.time.Clock
import org.trichter.app.features.recording.domain.LocalMediaRepository
import org.trichter.app.features.recording.domain.RecordedClip
import org.trichter.app.features.recording.domain.VideoOverlayProcessor
import org.trichter.app.features.recording.domain.models.LocalMedia
import org.trichter.app.features.recording.domain.models.LocalMediaKind
import org.trichter.app.features.recording.domain.models.LocalMediaSyncStatus
import org.trichter.app.util.Log

/**
 * Pipeline for finalizing a phone-recorded clip and attaching it to a saved run:
 *
 *   raw clip → overlay+transcode → persist LocalMedia row (status=PENDING).
 *
 * Upload is intentionally NOT performed here — the new `/runs/{id}/media`
 * endpoint isn't live yet. The video sits in the local DB until [SaveRun]
 * (slice 1) picks it up.
 */
class AttachRecordedVideoToRun(
    private val processor: VideoOverlayProcessor,
    private val mediaRepository: LocalMediaRepository,
) {
    suspend operator fun invoke(
        clip: RecordedClip,
        localRunId: Long,
        runStartWallclockMs: Long?,
        runEndWallclockMs: Long?,
        finalDurationMs: Long?,
    ): Result<Long> {
        val processed = processor.process(
            inputFilePath = clip.filePath,
            videoStartWallclockMs = clip.wallclockStartMs,
            runStartWallclockMs = runStartWallclockMs,
            runEndWallclockMs = runEndWallclockMs,
            finalDurationMs = finalDurationMs,
        ).getOrElse {
            Log.e("MEDIA", "Overlay processing failed, falling back to raw clip: ${it.message}")
            return mediaRepository.insert(
                LocalMedia(
                    localRunId = localRunId,
                    kind = LocalMediaKind.VIDEO,
                    filePath = clip.filePath,
                    contentType = "video/mp4",
                    durationMs = clip.durationMs,
                    syncStatus = LocalMediaSyncStatus.PENDING,
                    createdAt = Clock.System.now(),
                    updatedAt = Clock.System.now(),
                )
            )
        }
        return mediaRepository.insert(
            LocalMedia(
                localRunId = localRunId,
                kind = LocalMediaKind.VIDEO,
                filePath = processed.filePath,
                contentType = "video/mp4",
                durationMs = processed.durationMs,
                width = processed.width,
                height = processed.height,
                syncStatus = LocalMediaSyncStatus.PENDING,
                createdAt = Clock.System.now(),
                updatedAt = Clock.System.now(),
            )
        )
    }
}
