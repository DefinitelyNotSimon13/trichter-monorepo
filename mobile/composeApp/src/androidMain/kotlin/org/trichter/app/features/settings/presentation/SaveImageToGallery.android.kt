package org.trichter.app.features.settings.presentation

import android.content.ContentValues
import android.provider.MediaStore
import org.trichter.app.common.ContextProvider

actual fun saveImageToGallery(
    imageBytes: ByteArray,
    fileName: String,
): Result<Unit> = try {
    val context = ContextProvider.applicationContext
        ?: return Result.failure(IllegalStateException("Application context not initialized"))

    val resolver = context.contentResolver
    val values = ContentValues().apply {
        put(MediaStore.Images.Media.DISPLAY_NAME, fileName)
        put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg")
        put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/Trichter")
    }

    val uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)
        ?: return Result.failure(IllegalStateException("Failed to create MediaStore entry"))

    resolver.openOutputStream(uri).use { stream ->
        if (stream == null) return Result.failure(IllegalStateException("Failed to open MediaStore output stream"))
        stream.write(imageBytes)
        stream.flush()
    }

    Result.success(Unit)
} catch (e: Exception) {
    Result.failure(e)
}

