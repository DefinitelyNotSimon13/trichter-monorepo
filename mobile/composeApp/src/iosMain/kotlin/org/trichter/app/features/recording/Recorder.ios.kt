package org.trichter.app.features.recording.domain

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * iOS stub. Video recording is Android-only for now (see plan
 * `/home/simon/.claude/plans/i-am-already-uploading-unified-storm.md`).
 * Implement with AVCaptureSession + AVAssetWriter when bringing video to iOS.
 */
actual class Recorder actual constructor() {
    private val _isRecording = MutableStateFlow(false)
    actual val isRecording: StateFlow<Boolean> = _isRecording.asStateFlow()

    actual val isAvailable: Boolean = false

    actual suspend fun start(): Result<Unit> =
        Result.failure(UnsupportedOperationException("Recording not yet implemented on iOS"))

    actual suspend fun stop(): Result<RecordedClip?> = Result.success(null)

    actual suspend fun cancel() {}
}
