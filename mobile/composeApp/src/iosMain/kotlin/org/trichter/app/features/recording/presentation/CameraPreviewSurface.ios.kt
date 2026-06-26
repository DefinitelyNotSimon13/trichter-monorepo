package org.trichter.app.features.recording.presentation

import androidx.compose.foundation.layout.Box
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import org.trichter.app.features.recording.domain.Recorder

@Composable
actual fun CameraPreviewSurface(
    recorder: Recorder,
    modifier: Modifier,
) {
    Box(modifier)
}
