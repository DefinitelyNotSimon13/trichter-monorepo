package org.trichter.app.features.recording.domain

actual class VideoOverlayProcessor actual constructor() {
    actual val isAvailable: Boolean = false

    actual suspend fun process(
        inputFilePath: String,
        videoStartWallclockMs: Long,
        runStartWallclockMs: Long?,
        runEndWallclockMs: Long?,
        finalDurationMs: Long?,
    ): Result<ProcessedVideo> =
        Result.failure(UnsupportedOperationException("Video processing not yet implemented on iOS"))
}
