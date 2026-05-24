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
import org.trichter.app.features.ble.domain.usecases.SaveRun
import org.trichter.app.features.ble.domain.usecases.SearchUsers
import org.trichter.app.features.ble.domain.usecases.SendAck
import org.trichter.app.features.ble.domain.usecases.SendFakeRun
import org.trichter.app.features.ble.domain.usecases.SendReset
import org.trichter.app.features.ble.domain.usecases.StartScan
import org.trichter.app.features.ble.domain.usecases.StopScan


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
    private val searchUsersUseCase: SearchUsers,
    private val getCurrentUserUseCase: GetCurrentUser,
    private val bleServiceController: BleServiceController,
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

    init {
        observePermissionsStateUseCase().onEach { ps ->
            _state.value = _state.value.copy(permissionState = ps)
            if (ps == PermissionState.Granted) startScan() else stopScan()
        }.catch { e -> _state.value = _state.value.copy(error = e) }.launchIn(viewModelScope)

        observeScanResultsUseCase().onEach { onAdvertisement(it) }
            .catch { e -> _state.value = _state.value.copy(error = e) }.launchIn(viewModelScope)

        observeTrichterStateUseCase().onEach { trichterState ->
            val prev = _state.value.trichterState
            val wasConnected = prev?.connection == Connection.Connected ||
                    _state.value.connectionState == ConnectionState.Connected
            val isNowDisconnected = trichterState.connection == Connection.Disconnected

            // Reset runSaved when a new run cycle starts (status leaves COMPLETE)
            val runSaved = if (prev?.status == SessionStatus.COMPLETE &&
                trichterState.status != SessionStatus.COMPLETE
            ) false else _state.value.runSaved

            _state.update { it.copy(trichterState = trichterState, runSaved = runSaved) }

            if (wasConnected && isNowDisconnected && !intentionalDisconnect) {
                _state.update { it.copy(connectionState = ConnectionState.Disconnected) }
                bleServiceController.stop()
                _disconnectEvent.tryEmit(Unit)
            }
        }.catch { e -> _state.value = _state.value.copy(error = e) }.launchIn(viewModelScope)
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
        _state.update {
            it.copy(
                trichterState = it.trichterState?.copy(
                    imageStatus = ImageStatus.NONE,
                    lastResultMeta = null,
                    lastImage = null,
                    imageTransferState = null,
                )
            )
        }
    }

    fun onReset() = viewModelScope.launch { sendResetUseCase() }
    fun onFakeRun() = viewModelScope.launch { sendFakeRunUseCase() }

    fun saveRun() = viewModelScope.launch {
        _state.update { it.copy(isSaving = true) }
        val imageBytes = _state.value.trichterState?.lastImage
        val meta = _state.value.trichterState?.lastResultMeta
            ?: error("Tried to save run, but no data exists.")
        val userId = _searchUserState.value.selectedUser?.id

        saveRunUseCase(meta, imageBytes, userId).onSuccess {
            sendAckUseCase()
            _state.update { it.copy(isSaving = false, runSaved = true) }
        }.onFailure {
            _state.update { it.copy(isSaving = false, error = Exception("Failed to save run")) }
        }
    }

    fun onAdvertisement(advertisement: PlatformAdvertisement) {
        val next = _state.value.advertisements.toMutableMap()
        next[advertisement.id()] = advertisement
        _state.value = _state.value.copy(advertisements = next.toPersistentMap())
    }

    fun connect(advertisement: PlatformAdvertisement) {
        lastAdvertisement = advertisement
        intentionalDisconnect = false
        _state.value = _state.value.copy(
            connectionState = ConnectionState.Connecting,
            advertisements = persistentMapOf(),
            error = null
        )
        bleServiceController.start()
        viewModelScope.launch {
            val res = connectUseCase(advertisement)
            _state.value = res.fold(
                onSuccess = { _state.value.copy(connectionState = ConnectionState.Connected) },
                onFailure = { ex ->
                    bleServiceController.stop()
                    _state.value.copy(
                        connectionState = ConnectionState.Failed(ex.message ?: "Error")
                    )
                })
        }
    }

    fun disconnect() {
        intentionalDisconnect = true
        viewModelScope.launch {
            disconnectUseCase()
            bleServiceController.stop()
            _state.value = _state.value.copy(connectionState = ConnectionState.Disconnected)
        }
    }

    override fun onCleared() {
        stopScan()
        bleServiceController.stop()
        super.onCleared()
    }

    private val query = MutableStateFlow("")
    private val _searchUserState = MutableStateFlow(SearchUserState())
    val searchUserState: StateFlow<SearchUserState> = _searchUserState

    init {
        viewModelScope.launch {
            query
                .debounce(300)
                .map { it.trim() }
                .distinctUntilChanged()
                .flatMapLatest { q ->
                    if (q.isBlank()) flowOf(Result.success(emptyList()))
                    else flow { emit(searchUsersUseCase(q)) }
                }
                .onStart {
                    _searchUserState.update {
                        it.copy(
                            loading = true,
                            results = emptyList(),
                            error = null
                        )
                    }
                }
                .catch { e ->
                    _searchUserState.update {
                        it.copy(
                            loading = false,
                            error = e.message
                        )
                    }
                }
                .collect { result ->
                    result.fold(
                        onSuccess = { list ->
                            _searchUserState.update {
                                it.copy(
                                    loading = false,
                                    results = list,
                                    error = null
                                )
                            }
                        },
                        onFailure = { e ->
                            _searchUserState.update { it.copy(loading = false, error = e.message) }
                            _snackbar.emit("Failed to save run")
                        }
                    )
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
    }

    fun onClearUser() {
        _searchUserState.update { it.copy(selectedUser = null) }
    }

    fun onSelectSelf() {
        viewModelScope.launch {
            _searchUserState.update { it.copy(loading = true, error = null) }
            getCurrentUserUseCase().fold(
                onSuccess = { user ->
                    _searchUserState.update {
                        it.copy(
                            selectedUser = user,
                            loading = false,
                            query = "",
                            results = emptyList()
                        )
                    }
                    query.value = ""
                },
                onFailure = { e ->
                    _searchUserState.update { it.copy(loading = false, error = e.message) }
                }
            )
        }
    }
}

data class SearchUserState(
    val query: String = "",
    val loading: Boolean = false,
    val results: List<UserDto> = emptyList(),
    val error: String? = null,
    val selectedUser: UserDto? = null,
)
