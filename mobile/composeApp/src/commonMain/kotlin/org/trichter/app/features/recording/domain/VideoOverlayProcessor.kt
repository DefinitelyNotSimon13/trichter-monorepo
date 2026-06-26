package org.trichter.app.features.recording.domain

data class ProcessedVideo(
    val filePath: String,
    val durationMs: Long,
    val width: Int,
    val height: Int,
)

/**
 * Transcodes the input video to 1080p H.264 and burns in the trichter logo
 * plus a running timer whose T=0 is anchored to [runStartWallclockMs].
 *
 * The timer reads `0:00.00` before T=0 and freezes at [finalDurationMs] after
 * [runEndWallclockMs]. Frame correlation is done via the recorder's
 * `wallclockStartMs` + each frame's presentation time.
 */
expect class VideoOverlayProcessor() {
    val isAvailable: Boolean

    suspend fun process(
        inputFilePath: String,
        videoStartWallclockMs: Long,
        runStartWallclockMs: Long?,
        runEndWallclockMs: Long?,
        finalDurationMs: Long?,
    ): Result<ProcessedVideo>
}
