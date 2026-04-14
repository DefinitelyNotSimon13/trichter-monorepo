package org.trichter.backend.runs.storage

data class StoredImage(
    val ref: ImageRef,
    val contentType: String,
    val bytes: ByteArray,
)