package org.trichter.app.features.ble.domain.models

data class ImageChunk(
    val transferId: Long,
    val offset: Int,
    val payload: ByteArray,
    val isStart: Boolean,
    val isEnd: Boolean,
)

fun ByteArray.parseImageChunk(): ImageChunk? {
    if (size < 11) return null

    var o = 0
    fun u32(): Long {
        val v = (this[o].toInt() and 0xFF) or
                ((this[o + 1].toInt() and 0xFF) shl 8) or
                ((this[o + 2].toInt() and 0xFF) shl 16) or
                ((this[o + 3].toInt() and 0xFF) shl 24)
        o += 4
        return v.toLong() and 0xFFFFFFFFL
    }
    fun u16(): Int {
        val v = (this[o].toInt() and 0xFF) or
                ((this[o + 1].toInt() and 0xFF) shl 8)
        o += 2
        return v
    }
    fun u8(): Int = (this[o++].toInt() and 0xFF)

    val transferId = u32()
    val offset = u32().toInt()
    val payloadLen = u16()
    val flags = u8()

    if (size < o + payloadLen) return null

    val payload = copyOfRange(o, o + payloadLen)

    return ImageChunk(
        transferId = transferId,
        offset = offset,
        payload = payload,
        isStart = (flags and 0x01) != 0,
        isEnd = (flags and 0x02) != 0,
    )
}