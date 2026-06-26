package org.trichter.app.features.ble.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.juul.kable.PlatformAdvertisement
import dev.icerock.moko.permissions.PermissionState
import kotlinx.collections.immutable.persistentMapOf
import kotlinx.collections.immutable.toPersistentMap
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.onStart
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.trichter.app.features.ble.data.BleServiceController
import org.trichter.app.features.ble.domain.models.Connection
import org.trichter.app.features.ble.domain.models.ConnectionState
import org.trichter.app.features.ble.domain.models.ImageStatus
import org.trichter.app.features.ble.domain.models.SessionStatus
import org.trichter.app.features.ble.domain.models.UserDto
import org.trichter.app.features.ble.domain.models.id
import org.trichter.app.features.ble.domain.usecases.ConnectToDevice
import org.trichter.app.features.ble.domain.usecases.DisconnectFromDevice
import org.trichter.app.features.ble.domain.usecases.GetCurrentUser
import org.trichter.app.features.ble.domain.usecases.ObservePermissionsState
import org.trichter.app.features.ble.domain.usecases.ObserveScanResults
import org.trichter.app.features.ble.domain.usecases.ObserveTrichterState
import org.trichter.app.features.ble.domain.usecases.OpenAppSettings
import org.trichter.app.features.ble.domain.usecases.RequestBluetoothPermissions
import org.trichter.app.features.ble.domain.usecases.RequestCameraPermissions
import org.trichter.app.features.ble.domain.usecases.RequestNotificationPermissions
import org.trichter.app.features.ble.domain.usecases.SaveRun
import org.trichter.app.features.ble.domain.usecases.SaveRunLocally
import org.trichter.app.features.ble.domain.usecases.SearchUsers
import kotlin.time.Clock
import org.trichter.app.features.recording.domain.RecordedClip
import org.trichter.app.features.recording.domain.Recorder
import org.trichter.app.features.recording.domain.usecases.AttachRecordedVideoToRun
import org.trichter.app.features.ble.domain.usecases.SendAck
import org.trichter.app.features.ble.domain.usecases.SendFakeRun
import org.trichter.app.features.ble.domain.usecases.SendReset
import org.trichter.app.features.ble.domain.usecases.StartScan
import org.trichter.app.features.ble.domain.usecases.StopScan
import org.trichter.app.features.ble.domain.usecases.UpdateLocalRunSyncStatus
import org.trichter.app.features.ble.domain.usecases.UpdateLocalRunUser


@OptIn(FlowPreview::class, ExperimentalCoroutinesApi::class)
class BleViewModel(
    observePermissionsStateUseCase: ObservePermissionsState,
    observeScanResultsUseCase: ObserveScanResults,
    observeTrichterStateUseCase: ObserveTrichterState,
    private val requestBluetoothPermissionsUseCase: RequestBluetoothPermissions,
    private val openAppSettingsUseCase: OpenAppSettings,
    private val startScanUseCase: StartScan,
    private val stopScanUseCase: StopScan,
    private val connectUseCase: ConnectToDevice,
    private val disconnectUseCase: DisconnectFromDevice,
    private val sendAckUseCase: SendAck,
    private val sendResetUseCase: SendReset,
    private val sendFakeRunUseCase: SendFakeRun,
    private val saveRunUseCase: SaveRun,
    private val saveRunLocallyUseCase: SaveRunLocally,
    private val updateLocalRunSyncStatusUseCase: UpdateLocalRunSyncStatus,
    private val updateLocalRunUserUseCase: UpdateLocalRunUser,
    private val searchUsersUseCase: SearchUsers,
    private val getCurrentUserUseCase: GetCurrentUser,
    private val bleServiceController: BleServiceController,
    private val requestNotificationPermissionsUseCase: RequestNotificationPermissions,
    private val requestCameraPermissionsUseCase: RequestCameraPermissions,
    val recorder: Recorder,
    private val attachRecordedVideoToRunUseCase: AttachRecordedVideoToRun,
) : ViewModel() {

    private var _state = MutableStateFlow(BleUiState())
    val state: StateFlow<BleUiState> get() = _state

    private val _snackbar = MutableSharedFlow<String>()
    val snackbar = _snackbar.asSharedFlow()

    private val _disconnectEvent = MutableSharedFlow<Unit>(extraBufferCapacity = 1)
    val disconnectEvent: SharedFlow<Unit> = _disconnectEvent.asSharedFlow()

    // Track whether this disconnect was user-initiated (suppress snackbar in that case)
    private var intentionalDisconnect = false

    // Stored so reconnect doesn't need to re-scan
    private var lastAdvertisement: PlatformAdvertisement? = null

    private var lastLocallyStoredRunId: Long = -1

    private var runStartWallclockMs: Long? = null
    private var runEndWallclockMs: Long? = null

    // User search state
    private val query = MutableStateFlow("")
    private val _searchUserState = MutableStateFlow(SearchUserState())
    val searchUserState: StateFlow<SearchUserState> = _searchUserState


    init {
        observePermissionsStateUseCase().onEach { ps ->
            _state.update { it.copy(permissionState = ps) }
            if (ps == PermissionState.Granted) {
                if (_state.value.connectionState != ConnectionState.Connected) {
                    startScan()
                }
            } else {
                stopScan()
            }
        }.catch { e -> _state.update { it.copy(error = e) } }.launchIn(viewModelScope)

        observeScanResultsUseCase().onEach { onAdvertisement(it) }
            .catch { e -> _state.update { it.copy(error = e) } }.launchIn(viewModelScope)

        _state.update { it.copy(cameraAvailable = recorder.isAvailable) }
        recorder.isRecording.onEach { rec ->
            _state.update { it.copy(isRecording = rec) }
        }.launchIn(viewModelScope)

        observeTrichterStateUseCase().onEach { trichterState ->
            val prev = _state.value.trichterState

            val runSaved =
                if (prev?.status == SessionStatus.COMPLETE && trichterState.status != SessionStatus.COMPLETE) {
                    false
                } else {
                    _state.value.runSaved
                }

            // Capture wallclock anchors so we can burn an accurate timer into
            // any concurrently recorded video. T=0 is the RUNNING transition.
            if (prev?.status != SessionStatus.RUNNING && trichterState.status == SessionStatus.RUNNING) {
                runStartWallclockMs = Clock.System.now().toEpochMilliseconds()
                runEndWallclockMs = null
            }
            if (prev?.status == SessionStatus.RUNNING && trichterState.status == SessionStatus.COMPLETE) {
                runEndWallclockMs = Clock.System.now().toEpochMilliseconds()
            }
            // New session: clear the previous anchors.
            if (trichterState.status == SessionStatus.WAITING && prev?.status != SessionStatus.WAITING) {
                runStartWallclockMs = null
                runEndWallclockMs = null
            }

            _state.update {
                it.copy(
                    trichterState = trichterState,
                    runSaved = runSaved,
                    connectionState = when (trichterState.connection) {
                        Connection.Connected -> ConnectionState.Connected
                        Connection.Disconnected -> ConnectionState.Disconnected
                        else -> it.connectionState
                    }
                )
            }

            if (trichterState.connection == Connection.Connected) {
                stopScan()
            }

            val wasConnected =
                prev?.connection == Connection.Connected || _state.value.connectionState == ConnectionState.Connected

            val isNowDisconnected = trichterState.connection == Connection.Disconnected

            if (wasConnected && isNowDisconnected && !intentionalDisconnect) {
                bleServiceController.stop()
                _disconnectEvent.tryEmit(Unit)
            }

            val resultMeta = trichterState.lastResultMeta

            val isRunComplete = trichterState.status == SessionStatus.COMPLETE

            val imageTransferComplete =
                trichterState.imageStatus == ImageStatus.DONE || (trichterState.imageTransferState == null && resultMeta?.hasImage == false)

            if (isRunComplete && imageTransferComplete && !_state.value.runSavedLocally && resultMeta != null) {
                viewModelScope.launch {
                    val selectedUser = _searchUserState.value.selectedUser
                    saveRunLocallyUseCase(
                        resultMeta = resultMeta,
                        imageBytes = trichterState.lastImage,
                        userId = selectedUser?.id,
                        userDisplayName = selectedUser?.displayName(),
                    ).onSuccess { localRunId ->
                        lastLocallyStoredRunId = localRunId
                        _state.update { it.copy(runSavedLocally = true) }
                    }.onFailure { error ->
                        _snackbar.emit("Failed to save run locally: ${error.message}")
                    }
                }
            }
        }.catch { e -> _state.update { it.copy(error = e) } }.launchIn(viewModelScope)
    }

    fun onRequestPermissions() {
        viewModelScope.launch { requestBluetoothPermissionsUseCase() }
    }

    fun onOpenSettings() = openAppSettingsUseCase()

    fun startScan() {
        _state.update { it.copy(advertisements = persistentMapOf()) }
        viewModelScope.launch { startScanUseCase() }
    }

    fun stopScan() = stopScanUseCase()

    fun sendAck() = viewModelScope.launch {
        sendAckUseCase()
    }

    fun onReset() = viewModelScope.launch { sendResetUseCase() }
    fun onFakeRun() = viewModelScope.launch { sendFakeRunUseCase() }

    fun saveRun() = viewModelScope.launch {
        _state.update { it.copy(isSaving = true) }
        val imageBytes = _state.value.trichterState?.lastImage
        val meta = _state.value.trichterState?.lastResultMeta
            ?: error("Tried to save run, but no data exists.")
        val userId = _searchUserState.value.selectedUser?.id

        // If we were recording video alongside the run, stop now and remember
        // the clip so we can attach + transcode after the run is persisted.
        val recordedClip: RecordedClip? = if (recorder.isRecording.value) {
            recorder.stop().getOrNull()
        } else {
            null
        }

        saveRunUseCase(meta, imageBytes, userId).onSuccess {
            if (lastLocallyStoredRunId != -1L) {
                updateLocalRunSyncStatusUseCase(
                    localRunId = lastLocallyStoredRunId,
                    syncStatus = "SYNCED",
                    serverId = null,
                    errorMessage = null
                )
            }
            sendAckUseCase()
            attachRecording(recordedClip, meta.durationMs, lastLocallyStoredRunId)
            lastLocallyStoredRunId = -1L
            _state.update { it.copy(isSaving = false, runSaved = true) }
            _snackbar.emit("Run saved to server")
        }.onFailure { it ->
            if (lastLocallyStoredRunId != -1L) {
                updateLocalRunSyncStatusUseCase(
                    localRunId = lastLocallyStoredRunId,
                    syncStatus = "FAILED",
                    errorMessage = it.message ?: "Unknown error"
                )
            }
            // Even on server failure, keep the video locally attached to the
            // local run so the user doesn't lose the recording.
            attachRecording(recordedClip, meta.durationMs, lastLocallyStoredRunId)
            _state.update { it.copy(isSaving = false, error = Exception("Failed to save run")) }
            _snackbar.emit("Failed to save run to server")
        }
    }

    private fun attachRecording(clip: RecordedClip?, finalDurationMs: Long, runId: Long) {
        if (clip == null || runId == -1L) return
        _state.update { it.copy(isProcessingVideo = true) }
        viewModelScope.launch {
            attachRecordedVideoToRunUseCase(
                clip = clip,
                localRunId = runId,
                runStartWallclockMs = runStartWallclockMs,
                runEndWallclockMs = runEndWallclockMs,
                finalDurationMs = finalDurationMs,
            ).onFailure { e ->
                _snackbar.emit("Video processing failed: ${e.message}")
            }
            _state.update { it.copy(isProcessingVideo = false) }
        }
    }

    fun toggleRecording() = viewModelScope.launch {
        if (recorder.isRecording.value) {
            recorder.stop()
        } else {
            if (!recorder.isAvailable) {
                requestCameraPermissionsUseCase()
                _state.update { it.copy(cameraAvailable = recorder.isAvailable) }
                if (!recorder.isAvailable) {
                    _snackbar.emit("Camera permission denied")
                    return@launch
                }
            }
            recorder.start().onFailure { _snackbar.emit("Couldn't start recording: ${it.message}") }
        }
    }

    fun requestCameraIfNeeded() = viewModelScope.launch {
        if (recorder.isAvailable) return@launch
        requestCameraPermissionsUseCase()
        _state.update { it.copy(cameraAvailable = recorder.isAvailable) }
    }

    fun onAdvertisement(advertisement: PlatformAdvertisement) {
        val next = _state.value.advertisements.toMutableMap()
        next[advertisement.id()] = advertisement
        _state.update { it.copy(advertisements = next.toPersistentMap()) }
    }

    fun connect(advertisement: PlatformAdvertisement) {
        lastAdvertisement = advertisement
        intentionalDisconnect = false
        _state.update {
            it.copy(
                connectionState = ConnectionState.Connecting,
                advertisements = persistentMapOf(),
                error = null
            )
        }
        bleServiceController.start()
        viewModelScope.launch {
            requestNotificationPermissionsUseCase()
            val res = connectUseCase(advertisement)
            res.fold(onSuccess = {
                _state.update { it.copy(connectionState = ConnectionState.Connected) }
            }, onFailure = { ex ->
                bleServiceController.stop()
                _state.update {
                    it.copy(connectionState = ConnectionState.Failed(ex.message ?: "Error"))
                }
            })
        }
    }

    fun disconnect() {
        intentionalDisconnect = true
        viewModelScope.launch {
            if (recorder.isRecording.value) recorder.cancel()
            disconnectUseCase()
            bleServiceController.stop()
            _state.update { it.copy(connectionState = ConnectionState.Disconnected) }
            startScan()
        }
    }

    override fun onCleared() {
        stopScan()
        super.onCleared()
    }

    init {
        viewModelScope.launch {
            query.debounce(300).map { it.trim() }.distinctUntilChanged().flatMapLatest { q ->
                if (q.isBlank()) flowOf(Result.success(emptyList()))
                else flow { emit(searchUsersUseCase(q)) }
            }.onStart {
                _searchUserState.update {
                    it.copy(
                        loading = true, results = emptyList(), error = null
                    )
                }
            }.catch { e ->
                _searchUserState.update {
                    it.copy(
                        loading = false, error = e.message
                    )
                }
            }.collect { result ->
                result.fold(onSuccess = { list ->
                    _searchUserState.update {
                        it.copy(
                            loading = false, results = list, error = null
                        )
                    }
                }, onFailure = { e ->
                    _searchUserState.update { it.copy(loading = false, error = e.message) }
                    _snackbar.emit("Failed to save run")
                })
            }
        }
    }

    fun onQueryChange(newValue: String) {
        _searchUserState.update { it.copy(query = newValue) }
        query.value = newValue
    }

    fun onUserClick(user: UserDto) {
        _searchUserState.update { it.copy(selectedUser = user, query = "", results = emptyList()) }
        query.value = ""
        persistSelectedUser(user)
    }

    fun onClearUser() {
        _searchUserState.update { it.copy(selectedUser = null) }
    }

    fun onSelectSelf() {
        viewModelScope.launch {
            _searchUserState.update { it.copy(loading = true, error = null) }
            getCurrentUserUseCase().fold(onSuccess = { user ->
                _searchUserState.update {
                    it.copy(
                        selectedUser = user, loading = false, query = "", results = emptyList()
                    )
                }
                query.value = ""
                persistSelectedUser(user)
            }, onFailure = { e ->
                _searchUserState.update { it.copy(loading = false, error = e.message) }
            })
        }
    }

    private fun persistSelectedUser(user: UserDto) {
        val localRunId = lastLocallyStoredRunId
        if (localRunId == -1L) return

        viewModelScope.launch {
            updateLocalRunUserUseCase(localRunId, user.id, user.displayName())
        }
    }

    private fun UserDto.displayName(): String {
        return name ?: displayUsername ?: username ?: id
    }
}

data class SearchUserState(
    val query: String = "",
    val loading: Boolean = false,
    val results: List<UserDto> = emptyList(),
    val error: String? = null,
    val selectedUser: UserDto? = null,
)
