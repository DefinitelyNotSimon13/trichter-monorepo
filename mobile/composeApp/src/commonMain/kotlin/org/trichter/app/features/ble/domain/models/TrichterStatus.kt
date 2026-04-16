@file:OptIn(ExperimentalEncodingApi::class)

package org.trichter.app.features.ble.domain.models

import kotlin.io.encoding.ExperimentalEncodingApi

data class TrichterState(
    val connection: Connection = Connection.Disconnected,
    val status: SessionStatus = SessionStatus.UNKNOWN,
    val imageStatus: ImageStatus = ImageStatus.NONE,
    val lastResultMeta: ResultMeta? = null,
    val lastImage: ByteArray? = null,
    val imageTransferState: ImageTransferState? = null

)

enum class Connection { Disconnected, Connecting, Connected }
enum class SessionStatus { IDLE, WAITING, RUNNING, COMPLETE, ERROR, UNKNOWN }

enum class ImageStatus { NONE, TRANSFERRING, DONE}

data class ImageTransferState(
    val expectedBytes: Int,
            val receivedBytes: Int,
) {
    public fun percentageReceived(): Double = ( this.receivedBytes.toDouble() / expectedBytes.toDouble()) * 100.0
}

data class ResultMeta(
    val durationMs: Long,
    val rateLpm: Float,
    val volumeL: Float,
    val hasImage: Boolean,
    val imageSize: Int
)

fun ResultMeta.toNewRun(image: String? = null, userId: String? = null): NewRunDto =
    NewRunDto(
        durationS = durationMs / 1000f,
        rateLpm   = rateLpm,
        volumeL   = volumeL,
        image     = image,
        userId    = userId,
    )
