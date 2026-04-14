package org.trichter.backend.runs.storage

import java.time.Instant

data class SignedImageUrl(
    val imageRef: ImageRef,
    val url: String,
    val expiresAt: Instant
)
