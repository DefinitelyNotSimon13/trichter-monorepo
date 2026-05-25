package org.trichter.app.features.settings.presentation

actual fun saveImageToGallery(
    imageBytes: ByteArray,
    fileName: String,
): Result<Unit> = Result.failure(UnsupportedOperationException("Save image to gallery is not implemented on iOS yet"))

