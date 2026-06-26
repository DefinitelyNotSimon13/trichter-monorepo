package org.trichter.app.features.recording.domain

import kotlinx.coroutines.flow.StateFlow

/**
 * Result of a finalized recording on disk.
 *
 * @param filePath Absolute path to the raw recorded clip (cache dir).
 * @param wallclockStartMs `System.currentTimeMillis()` captured at recording start;
 *   used to correlate video frames with the trichter run state machine.
 * @param durationMs Estimated wallclock duration of the clip.
 */
data class RecordedClip(
    val filePath: String,
    val wallclockStartMs: Long,
    val durationMs: Long,
)

/**
 * Platform recorder. Android uses CameraX VideoCapture. iOS is a no-op stub.
 *
 * Lifecycle: implementations are expected to be a Koin singleton bound to the
 * application; call [start] on a coroutine that lives at least as long as the
 * recording, then [stop] to finalize.
 */
expect class Recorder() {
    val isRecording: StateFlow<Boolean>
    val isAvailable: Boolean

    /** Starts recording to a fresh file in the platform cache dir. */
    suspend fun start(): Result<Unit>

    /** Stops and finalizes the active recording. Returns null if nothing was recording. */
    suspend fun stop(): Result<RecordedClip?>

    /** Cancels and deletes any in-flight recording. */
    suspend fun cancel()
}
