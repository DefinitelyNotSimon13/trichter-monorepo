package org.trichter.backend.runs.storage

import java.time.Duration
import java.util.UUID

interface ImageStorage {
    fun putRunImage(
        runId: UUID,
        bytes: ByteArray,
        contentType: String
    ): ImageRef

    fun get(imageRef: ImageRef): StoredImage?

    fun generateSignedUrl(
        imageRef: ImageRef,
        ttl: Duration
    ) : SignedImageUrl

    fun delete(imageRef: ImageRef)
}