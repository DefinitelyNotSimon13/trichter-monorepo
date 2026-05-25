package org.trichter.app.features.settings.presentation

expect fun saveImageToGallery(
    imageBytes: ByteArray,
    fileName: String,
): Result<Unit>

