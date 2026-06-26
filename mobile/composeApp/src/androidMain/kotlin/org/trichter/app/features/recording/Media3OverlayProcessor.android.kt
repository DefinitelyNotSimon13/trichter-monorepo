package org.trichter.app.features.recording.domain

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import androidx.media3.common.Effect
import androidx.media3.common.MediaItem
import androidx.media3.common.MimeTypes
import androidx.media3.common.util.UnstableApi
import androidx.media3.effect.CanvasOverlay
import androidx.media3.effect.OverlayEffect
import androidx.media3.transformer.Composition
import androidx.media3.transformer.EditedMediaItem
import androidx.media3.transformer.Effects
import androidx.media3.transformer.ExportException
import androidx.media3.transformer.ExportResult
import androidx.media3.transformer.Transformer
import com.google.common.collect.ImmutableList
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.trichter.app.util.Log
import java.io.File
import kotlin.coroutines.resume

@UnstableApi
actual class VideoOverlayProcessor actual constructor() : KoinComponent {
    private val context: Context by inject()

    actual val isAvailable: Boolean = true

    actual suspend fun process(
        inputFilePath: String,
        videoStartWallclockMs: Long,
        runStartWallclockMs: Long?,
        runEndWallclockMs: Long?,
        finalDurationMs: Long?,
    ): Result<ProcessedVideo> = withContext(Dispatchers.Main) {
        try {
            val input = File(inputFilePath)
            if (!input.exists()) {
                return@withContext Result.failure(IllegalArgumentException("Input not found: $inputFilePath"))
            }
            val output = File(context.cacheDir, "trichter-processed-${System.currentTimeMillis()}.mp4")

            val overlay = TimerOverlay(
                videoStartWallclockMs = videoStartWallclockMs,
                runStartWallclockMs = runStartWallclockMs,
                runEndWallclockMs = runEndWallclockMs,
                finalDurationMs = finalDurationMs,
            )
            val overlayEffect: Effect = OverlayEffect(ImmutableList.of(overlay))

            val edited = EditedMediaItem.Builder(MediaItem.fromUri(input.toURI().toString()))
                .setEffects(Effects(ImmutableList.of(), ImmutableList.of(overlayEffect)))
                .build()

            val result = runTransformer(edited, output)
            Result.success(
                ProcessedVideo(
                    filePath = output.absolutePath,
                    durationMs = result.durationMs,
                    width = 1920,
                    height = 1080,
                )
            )
        } catch (e: Exception) {
            Log.e("OVERLAY", "process failed: ${e.message}")
            Result.failure(e)
        }
    }

    @UnstableApi
    private suspend fun runTransformer(
        edited: EditedMediaItem,
        output: File,
    ): ExportResult = suspendCancellableCoroutine { cont ->
        val transformer = Transformer.Builder(context)
            .setVideoMimeType(MimeTypes.VIDEO_H264)
            .addListener(object : Transformer.Listener {
                override fun onCompleted(composition: Composition, exportResult: ExportResult) {
                    if (cont.isActive) cont.resume(exportResult)
                }

                override fun onError(
                    composition: Composition,
                    exportResult: ExportResult,
                    exportException: ExportException,
                ) {
                    if (cont.isActive) cont.resumeWith(Result.failure(exportException))
                }
            })
            .build()
        cont.invokeOnCancellation { transformer.cancel() }
        transformer.start(edited, output.absolutePath)
    }
}

/**
 * Per-frame overlay drawing the trichter logo (top-left) and run timer (top-right).
 *
 * Timer math: `elapsedMs = (videoStartWallclock + framePresentationMs) - runStartWallclock`.
 * Before T=0 the timer reads `0:00.00`; after the run ends it freezes at the
 * reported `finalDurationMs`. If no run wallclock is known (recording without
 * an active session) the timer is hidden entirely.
 */
@UnstableApi
private class TimerOverlay(
    private val videoStartWallclockMs: Long,
    private val runStartWallclockMs: Long?,
    private val runEndWallclockMs: Long?,
    private val finalDurationMs: Long?,
) : CanvasOverlay(/* useInputFrameSize = */ true) {

    private val timerPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.WHITE
        textSize = 64f
        typeface = Typeface.create(Typeface.MONOSPACE, Typeface.BOLD)
        setShadowLayer(8f, 2f, 2f, Color.argb(180, 0, 0, 0))
    }
    private val logoPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.WHITE
        textSize = 48f
        typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        setShadowLayer(6f, 1f, 1f, Color.argb(180, 0, 0, 0))
    }

    override fun onDraw(canvas: Canvas, presentationTimeUs: Long) {
        val w = canvas.width
        val h = canvas.height
        val margin = (h * 0.04f)

        canvas.drawText("TRICHTER", margin, margin + logoPaint.textSize, logoPaint)

        if (runStartWallclockMs == null) return
        val frameWallclockMs = videoStartWallclockMs + presentationTimeUs / 1_000L
        val elapsedMs = when {
            frameWallclockMs < runStartWallclockMs -> 0L
            runEndWallclockMs != null && frameWallclockMs >= runEndWallclockMs ->
                finalDurationMs ?: (runEndWallclockMs - runStartWallclockMs)
            else -> frameWallclockMs - runStartWallclockMs
        }
        val text = formatElapsed(elapsedMs)
        val textWidth = timerPaint.measureText(text)
        canvas.drawText(text, w - margin - textWidth, margin + timerPaint.textSize, timerPaint)
    }

    private fun formatElapsed(ms: Long): String {
        val totalCs = ms / 10
        val cs = totalCs % 100
        val totalSec = totalCs / 100
        val s = totalSec % 60
        val m = totalSec / 60
        return "%d:%02d.%02d".format(m, s, cs)
    }
}
