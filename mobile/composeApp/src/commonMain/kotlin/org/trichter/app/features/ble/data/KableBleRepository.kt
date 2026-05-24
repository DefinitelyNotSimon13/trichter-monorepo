@file:OptIn(ExperimentalUuidApi::class)

package org.trichter.app.features.ble.data

import com.juul.kable.Filter
import com.juul.kable.Peripheral
import com.juul.kable.PlatformAdvertisement
import com.juul.kable.Scanner
import com.juul.kable.State
import com.juul.kable.characteristicOf
import com.juul.kable.logs.Logging
import com.juul.kable.logs.SystemLogEngine
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.trichter.app.features.ble.domain.BleRepository
import org.trichter.app.features.ble.domain.models.TrichterState
import org.trichter.app.features.ble.domain.models.Connection
import org.trichter.app.features.ble.domain.models.ImageStatus
import org.trichter.app.features.ble.domain.models.ImageTransferState
import org.trichter.app.features.ble.domain.models.ResultMeta
import org.trichter.app.features.ble.domain.models.SessionStatus
import org.trichter.app.features.ble.domain.models.parseImageChunk
import org.trichter.app.util.Log
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid


class KableBleRepository(
    private val scope: CoroutineScope,
) : BleRepository {

    private val _state = MutableStateFlow(TrichterState())
    override val trichterState: StateFlow<TrichterState> = _state

    private lateinit var peripheral: Peripheral
    private var observeJobs: List<Job> = emptyList()

    private val scanner = Scanner {
        filters { match { name = Filter.Name.Prefix("Trichter") } }
        logging {
            engine = SystemLogEngine
            level = Logging.Level.Events
            format = Logging.Format.Multiline
        }

    }


    private val _scanResults =
        MutableSharedFlow<PlatformAdvertisement>(replay = 0, extraBufferCapacity = 64)
    override val scanResults = _scanResults.asSharedFlow()


    private var scanJob: Job? = null

    private var currentImageBuffer: ByteArray? = null
    private var currentImageSize: Int = 0
    private var currentTransferId: Long? = null
    private var chunksSinceAck = 0
    private val ackEveryChunks =8


    @OptIn(ExperimentalCoroutinesApi::class)
    override suspend fun startScan() {
        _scanResults.resetReplayCache()
        if (scanJob?.isActive == true) return
        scanJob = scope.launch {
            scanner.advertisements
                .onEach { ad -> _scanResults.tryEmit(ad) }
                .collect()
        }
    }


    @OptIn(ExperimentalCoroutinesApi::class)
    override fun stopScan() {
        scanJob?.cancel(); scanJob = null
        _scanResults.resetReplayCache()
    }


    @OptIn(ExperimentalUuidApi::class)
    override suspend fun connect(advertisement: PlatformAdvertisement): Result<Unit> = runCatching {
        peripheral = Peripheral(advertisement) {
            logging {
                engine = SystemLogEngine
                level = Logging.Level.Events
                format = Logging.Format.Multiline
            }

            onServicesDiscovered {
                Log.d("BLE", "Requested MTU 247")
            }


        }
        peripheral.connect()
        peripheral.requestMtu(247)

        val s0 = scope.launch {
            peripheral.state.collect { conn ->
                _state.update {
                    it.copy(
                        connection = when (conn) {
                            is State.Connected -> Connection.Connected
                            is State.Connecting -> Connection.Connecting
                            else -> Connection.Disconnected
                        }
                    )
                }
            }
        }

        val s1 = scope.launch {
            peripheral.observe(chStatus).collect { bytes ->
                if (bytes.isNotEmpty()) {
                    Log.d("BLE", "Bytes: $bytes")
                    Log.d("BLE", "First: ${bytes.first()}")
                    Log.d("BLE", "Last: ${bytes.last()}")
                    _state.update { it.copy(status = bytes.first().toSessionStatus()) }
                }
            }
        }

        val s2 = scope.launch {
            peripheral.observe(chResult).collect { bytes ->
                bytes.parseResult()?.let { res ->
                    Log.d("BLE", "Result updated!")
                    _state.update { it.copy(lastResultMeta = res.meta) }

                    if (res.hasImage && res.imageSize > 0) {
                        Log.d("BLE", "Requesting image transfer size=${res.imageSize}")
                        sendImageStart()
                    } else {
                        _state.update { it.copy(imageStatus = ImageStatus.NONE)}
                        sendAck()
                    }
                }
            }
        }

        val s3 = scope.launch {
            peripheral.observe(chImage).collect { bytes ->
                val chunk = bytes.parseImageChunk() ?: run {
                    Log.w("BLE", "Invalid image chunk")
                    return@collect
                }

                val expectedSize = _state.value.lastResultMeta?.imageSize ?: 0
                if (expectedSize <= 0) {
                    Log.w("BLE", "Received image chunk without expected image size")
                    return@collect
                }

                if (chunk.isStart || currentImageBuffer == null || currentImageSize != expectedSize) {
                    currentImageBuffer = ByteArray(expectedSize)
                    currentImageSize = expectedSize
                    currentTransferId = chunk.transferId

                    Log.d("BLE", "Starting image assembly transferId=${chunk.transferId} size=$expectedSize")
                }

                val buf = currentImageBuffer ?: return@collect

                if (chunk.offset + chunk.payload.size > buf.size) {
                    Log.e("BLE", "Chunk out of bounds: offset=${chunk.offset} len=${chunk.payload.size} size=${buf.size}")
                    return@collect
                }

                chunk.payload.copyInto(buf, destinationOffset = chunk.offset)
                _state.update { it.copy(imageTransferState = ImageTransferState(it.lastResultMeta?.imageSize ?: 0,  this@KableBleRepository.currentImageBuffer?.size ?: 0)) }
                Log.d("BLE", "Image chunk received: offset=${chunk.offset} len=${chunk.payload.size}")

                chunksSinceAck++

                if (chunk.isEnd) {
                    Log.d("BLE", "Image transfer complete")
                    _state.update { it.copy(lastImage = buf.copyOf(), imageStatus = ImageStatus.DONE) }
                    currentImageBuffer = null
                    currentImageSize = 0
                    currentTransferId = null
                    chunksSinceAck = 0
                    sendImageReceived()
                } else if (chunksSinceAck >= ackEveryChunks) {
                    chunksSinceAck = 0
                    sendImageAck()
                }
            }
        }

        observeJobs = listOf(s0, s1, s2, s3)
    }

    override suspend fun disconnect() {
        observeJobs.forEach { it.cancel() }; runCatching { peripheral.disconnect() }
    }

    override suspend fun sendAck() {
        peripheral.write(chControl, byteArrayOf(0x02))
    }

    override suspend fun sendReset() {
        peripheral.write(chControl, byteArrayOf(0x03))
    }

    override suspend fun sendFakeRun() {
        peripheral.write(chControl, byteArrayOf(0x04))
    }

    suspend fun sendImageStart() {
        _state.update { it.copy(imageStatus = ImageStatus.TRANSFERRING) }
        peripheral.write(chControl, byteArrayOf(0x05))
    }

    suspend fun sendImageAck() {
        peripheral.write(chControl, byteArrayOf(0x07))
    }

    suspend fun sendImageReceived() {
        peripheral.write(chControl, byteArrayOf(0x08))
    }


    companion object {
        private val TRICHTER_SERVICE_UUID = Uuid.parse("12345678-1234-5678-9ABC-DEF012345678")
        private val TRICHTER_CHAR_STATUS = Uuid.parse("12345678-1234-5678-9ABC-DEF012345679")
        private val TRICHTER_CHAR_RESULT = Uuid.parse("12345678-1234-5678-9ABC-DEF01234567A")
        private val TRICHTER_CHAR_CONTROL = Uuid.parse("12345678-1234-5678-9ABC-DEF01234567B")
        private val TRICHTER_CHAR_IMAGE = Uuid.parse("12345678-1234-5678-9ABC-DEF01234567C")

        private val chStatus = characteristicOf(TRICHTER_SERVICE_UUID, TRICHTER_CHAR_STATUS)
        private val chResult = characteristicOf(TRICHTER_SERVICE_UUID, TRICHTER_CHAR_RESULT)
        private val chControl = characteristicOf(TRICHTER_SERVICE_UUID, TRICHTER_CHAR_CONTROL)
        private val chImage = characteristicOf(TRICHTER_SERVICE_UUID, TRICHTER_CHAR_IMAGE)
    }
}

private fun Byte.toSessionStatus(): SessionStatus = when (this.toInt() and 0xFF) {
    0x00 -> SessionStatus.IDLE
    0x01 -> SessionStatus.WAITING
    0x02 -> SessionStatus.RUNNING
    0x03 -> SessionStatus.COMPLETE
    0x04 -> SessionStatus.ERROR
    else -> SessionStatus.UNKNOWN
}

private fun ByteArray.parseResult(): ParsedResult? {
    if (this.size < 17) return null

    var offset = 0

    fun u32(): UInt {
        val v = (this[offset].toInt() and 0xFF) or
                ((this[offset + 1].toInt() and 0xFF) shl 8) or
                ((this[offset + 2].toInt() and 0xFF) shl 16) or
                ((this[offset + 3].toInt() and 0xFF) shl 24)
        offset += 4
        return v.toUInt()
    }

    fun f32(): Float {
        val bits = u32().toInt()
        return Float.fromBits(bits)
    }

    val durationMs = u32().toLong()
    val rateLpm = f32()
    val volumeL = f32()
    val hasImage = (this[offset++].toInt() and 0xFF) == 1
    val imageSize = u32().toInt()

    return ParsedResult(ResultMeta(durationMs, rateLpm, volumeL, hasImage, imageSize))
}

private data class ParsedResult(val meta: ResultMeta) {
    val hasImage get() = meta.hasImage
    val imageSize get() = meta.imageSize
}

expect suspend fun Peripheral.requestMtu(mtu: Int)