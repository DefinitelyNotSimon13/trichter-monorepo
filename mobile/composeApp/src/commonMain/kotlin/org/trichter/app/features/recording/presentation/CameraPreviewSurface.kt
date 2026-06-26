package org.trichter.app.features.recording.presentation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import org.trichter.app.features.recording.domain.Recorder

/**
 * Renders a live camera preview bound to the platform [Recorder].
 *
 * On platforms without a recorder implementation (iOS today) this composes
 * nothing — call sites should also check [Recorder.isAvailable] to decide
 * whether to show recording controls at all.
 */
@Composable
expect fun CameraPreviewSurface(
    recorder: Recorder,
    modifier: Modifier = Modifier,
)
