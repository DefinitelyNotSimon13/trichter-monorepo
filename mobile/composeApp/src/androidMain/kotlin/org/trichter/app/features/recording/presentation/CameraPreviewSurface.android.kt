package org.trichter.app.features.recording.presentation

import androidx.camera.core.Preview
import androidx.camera.view.PreviewView
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.compose.LocalLifecycleOwner
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import org.trichter.app.features.recording.domain.Recorder

@Composable
actual fun CameraPreviewSurface(
    recorder: Recorder,
    modifier: Modifier,
) {
    val context = LocalContext.current
    val lifecycleOwner: LifecycleOwner = LocalLifecycleOwner.current
    val previewView = remember { PreviewView(context) }
    val scope = remember { CoroutineScope(SupervisorJob() + Dispatchers.Main) }

    AndroidView(
        factory = { previewView },
        modifier = modifier,
    )

    DisposableEffect(lifecycleOwner, recorder) {
        val job: Job = scope.launch {
            val preview = Preview.Builder().build().apply {
                surfaceProvider = previewView.surfaceProvider
            }
            recorder.bindToLifecycle(lifecycleOwner, preview)
        }
        onDispose {
            job.cancel()
            scope.cancel()
        }
    }
}
