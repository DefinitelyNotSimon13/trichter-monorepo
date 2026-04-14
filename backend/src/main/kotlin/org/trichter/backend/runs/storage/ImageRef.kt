package org.trichter.backend.runs.storage

data class ImageRef(
    val key: String
) {
    fun into(): String = this.key
}

fun String.into(): ImageRef = ImageRef(this)