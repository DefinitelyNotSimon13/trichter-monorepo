package org.trichter.app.features.recording.domain

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import androidx.camera.core.CameraSelector
import androidx.camera.core.UseCase
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.video.FileOutputOptions
import androidx.camera.video.Quality
import androidx.camera.video.QualitySelector
import androidx.camera.video.Recording
import androidx.camera.video.VideoCapture
import androidx.camera.video.VideoRecordEvent
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ProcessLifecycleOwner
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.trichter.app.util.Log
import java.io.File
import java.util.concurrent.Executor
import kotlin.coroutines.resume
import androidx.camera.video.Recorder as CameraXRecorderImpl

/**
 * CameraX-backed recorder shared across the app via Koin.
 *
 * The same [VideoCapture] use case is bound to the application
 * [ProcessLifecycleOwner], so the camera stays available while the user
 * navigates between screens. The preview surface attaches/detaches its own
 * `Preview` use case via [bindToLifecycle].
 */
@SuppressLint("RestrictedApi")
actual class Recorder actual constructor() : KoinComponent {
    private val context: Context by inject()
    private val mainExecutor: Executor get() = ContextCompat.getMainExecutor(context)
    private val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

    private val recorderImpl: CameraXRecorderImpl by lazy {
        CameraXRecorderImpl.Builder()
            .setQualitySelector(QualitySelector.from(Quality.FHD))
            .build()
    }

    val videoCapture: VideoCapture<CameraXRecorderImpl> by lazy {
        VideoCapture.withOutput(recorderImpl)
    }

    private val _isRecording = MutableStateFlow(false)
    actual val isRecording: StateFlow<Boolean> = _isRecording.asStateFlow()

    actual val isAvailable: Boolean
        get() = ContextCompat.checkSelfPermission(
            context, Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED &&
            ContextCompat.checkSelfPermission(
                context, Manifest.permission.RECORD_AUDIO
            ) == PackageManager.PERMISSION_GRANTED

    private var activeRecording: Recording? = null
    private var activeFile: File? = null
    private var activeFinalizer: CompletableDeferred<Result<RecordedClip?>>? = null

    /**
     * Binds the persistent VideoCapture + an optional preview to a lifecycle.
     * Called by the preview composable when it appears on-screen.
     */
    suspend fun bindToLifecycle(
        lifecycleOwner: LifecycleOwner,
        preview: androidx.camera.core.Preview?,
    ) {
        val provider = awaitCameraProvider()
        withContext(Dispatchers.Main) {
            provider.unbindAll()
            val useCases = mutableListOf<UseCase>(videoCapture)
            if (preview != null) useCases += preview
            provider.bindToLifecycle(
                lifecycleOwner,
                cameraSelector,
                *useCases.toTypedArray()
            )
        }
    }

    suspend fun unbindAll() {
        val provider = awaitCameraProvider()
        withContext(Dispatchers.Main) { provider.unbindAll() }
    }

    @SuppressLint("MissingPermission")
    actual suspend fun start(): Result<Unit> = withContext(Dispatchers.Main) {
        if (activeRecording != null) {
            return@withContext Result.failure(IllegalStateException("Already recording"))
        }
        if (!isAvailable) {
            return@withContext Result.failure(SecurityException("Camera/audio permission not granted"))
        }
        try {
            if (videoCapture.camera == null) {
                bindToLifecycle(ProcessLifecycleOwner.get(), preview = null)
            }

            val outputFile = File(
                context.cacheDir,
                "trichter-recording-${System.currentTimeMillis()}.mp4"
            )
            val outputOptions = FileOutputOptions.Builder(outputFile).build()
            val pending = recorderImpl.prepareRecording(context, outputOptions)
                .withAudioEnabled()

            val finalizer = CompletableDeferred<Result<RecordedClip?>>()
            val wallclockStart = System.currentTimeMillis()

            val recording = pending.start(mainExecutor) { event ->
                when (event) {
                    is VideoRecordEvent.Start -> {
                        _isRecording.value = true
                    }
                    is VideoRecordEvent.Finalize -> {
                        _isRecording.value = false
                        activeRecording = null
                        val file = activeFile
                        activeFile = null
                        if (event.hasError()) {
                            Log.e("REC", "Recording finalize error: ${event.error}")
                            file?.delete()
                            finalizer.complete(
                                Result.failure(
                                    RuntimeException(
                                        "Recording failed (code=${event.error})",
                                        event.cause
                                    )
                                )
                            )
                        } else {
                            val durationNs = event.recordingStats.recordedDurationNanos
                            finalizer.complete(
                                Result.success(
                                    RecordedClip(
                                        filePath = file?.absolutePath ?: outputFile.absolutePath,
                                        wallclockStartMs = wallclockStart,
                                        durationMs = durationNs / 1_000_000L,
                                    )
                                )
                            )
                        }
                    }
                    else -> Unit
                }
            }
            activeRecording = recording
            activeFile = outputFile
            activeFinalizer = finalizer
            Result.success(Unit)
        } catch (e: Exception) {
            Log.e("REC", "start failed: ${e.message}")
            Result.failure(e)
        }
    }

    actual suspend fun stop(): Result<RecordedClip?> = withContext(Dispatchers.Main) {
        val recording = activeRecording ?: return@withContext Result.success(null)
        val finalizer = activeFinalizer
            ?: return@withContext Result.failure(IllegalStateException("Missing finalizer"))
        recording.stop()
        finalizer.await()
    }

    actual suspend fun cancel() {
        withContext(Dispatchers.Main) {
            val recording = activeRecording ?: return@withContext
            recording.stop()
            activeFinalizer?.await()
            activeFile?.delete()
            activeFile = null
        }
    }

    private suspend fun awaitCameraProvider(): ProcessCameraProvider =
        suspendCancellableCoroutine { cont ->
            val future = ProcessCameraProvider.getInstance(context)
            future.addListener({
                try {
                    cont.resume(future.get())
                } catch (e: Throwable) {
                    cont.resumeWith(Result.failure(e))
                }
            }, mainExecutor)
        }
}
