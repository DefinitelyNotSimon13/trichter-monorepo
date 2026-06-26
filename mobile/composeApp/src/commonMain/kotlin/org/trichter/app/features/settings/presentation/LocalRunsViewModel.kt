package org.trichter.app.features.settings.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.trichter.app.features.ble.domain.models.LocalRun
import org.trichter.app.features.ble.domain.models.ResultMeta
import org.trichter.app.features.ble.domain.usecases.GetLocalRuns
import org.trichter.app.features.ble.domain.usecases.DeleteLocalRun
import org.trichter.app.features.ble.domain.usecases.SaveRun
import org.trichter.app.features.ble.domain.usecases.UpdateLocalRunSyncStatus
import org.trichter.app.features.ble.domain.usecases.SearchUsers
import org.trichter.app.features.ble.domain.usecases.GetCurrentUser
import org.trichter.app.features.ble.domain.usecases.UpdateLocalRunUser
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.onEach
import org.trichter.app.features.ble.domain.models.UserDto
import org.trichter.app.features.recording.domain.LocalMediaRepository
import org.trichter.app.features.recording.domain.models.LocalMediaKind

data class LocalRunsUiState(
    val runs: List<LocalRun> = emptyList(),
    val videoCountByRunId: Map<Long, Int> = emptyMap(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val message: String? = null,
    val selectedRunId: Long? = null,
    val userPickerRunId: Long? = null,
    val userQuery: String = "",
    val userResults: List<UserDto> = emptyList(),
    val userLoading: Boolean = false,
    val userError: String? = null,
    val selectedUsers: Map<Long, UserDto> = emptyMap(),
)

@OptIn(FlowPreview::class, ExperimentalCoroutinesApi::class)
class LocalRunsViewModel(
    private val getLocalRunsUseCase: GetLocalRuns,
    private val deleteLocalRunUseCase: DeleteLocalRun,
    private val saveRunUseCase: SaveRun,
    private val updateLocalRunSyncStatusUseCase: UpdateLocalRunSyncStatus,
    private val searchUsersUseCase: SearchUsers,
    private val getCurrentUserUseCase: GetCurrentUser,
    private val updateLocalRunUserUseCase: UpdateLocalRunUser,
    private val localMediaRepository: LocalMediaRepository,
) : ViewModel() {

    private val _state = MutableStateFlow(LocalRunsUiState())
    val state: StateFlow<LocalRunsUiState> = _state.asStateFlow()

    private val userQuery = MutableStateFlow("")

    init {
        loadLocalRuns()
        observeUserSearch()
        observeMedia()
    }

    private fun observeMedia() {
        localMediaRepository.observeAll()
            .onEach { mediaList ->
                val counts = mediaList
                    .filter { it.kind == LocalMediaKind.VIDEO }
                    .groupingBy { it.localRunId }
                    .eachCount()
                _state.update { it.copy(videoCountByRunId = counts) }
            }
            .launchIn(viewModelScope)
    }

    fun loadLocalRuns() {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true, error = null) }
            getLocalRunsUseCase().fold(
                onSuccess = { runs ->
                    _state.update { it.copy(isLoading = false, runs = runs) }
                },
                onFailure = { error ->
                    _state.update {
                        it.copy(
                            isLoading = false,
                            error = error.message ?: "Failed to load runs"
                        )
                    }
                }
            )
        }
    }

    fun deleteRun(id: Long) {
        viewModelScope.launch {
            deleteLocalRunUseCase(id).fold(
                onSuccess = { loadLocalRuns() },
                onFailure = { error ->
                    _state.update {
                        it.copy(error = error.message ?: "Failed to delete run")
                    }
                }
            )
        }
    }

    fun syncRun(run: LocalRun) {
        val id = run.id
        if (id == null) {
            _state.update { it.copy(error = "Missing local run id") }
            return
        }

        val selectedUserId = run.userId ?: _state.value.selectedUsers[id]?.id
        if (selectedUserId.isNullOrBlank()) {
            _state.update { it.copy(error = "Select a user before syncing this run") }
            return
        }

        viewModelScope.launch {
            val meta = ResultMeta(
                durationMs = run.durationMs,
                rateLpm = run.rateLpm,
                volumeL = run.volumeL,
                hasImage = run.imageData != null,
                imageSize = run.imageData?.size ?: 0,
            )

            saveRunUseCase(meta, run.imageData, selectedUserId).fold(
                onSuccess = {
                    updateLocalRunSyncStatusUseCase(
                        localRunId = id,
                        syncStatus = "SYNCED",
                        serverId = null,
                        errorMessage = null,
                    )
                    _state.update { it.copy(message = "Run synced") }
                    loadLocalRuns()
                },
                onFailure = { error ->
                    updateLocalRunSyncStatusUseCase(
                        localRunId = id,
                        syncStatus = "FAILED",
                        errorMessage = error.message ?: "Sync failed",
                    )
                    _state.update { it.copy(error = error.message ?: "Failed to sync run") }
                    loadLocalRuns()
                }
            )
        }
    }

    fun saveImage(run: LocalRun) {
        val imageBytes = run.imageData
        if (imageBytes == null) {
            _state.update { it.copy(error = "No image available for this run") }
            return
        }

        val fileName = "trichter_run_${run.id ?: "unsynced"}.jpg"
        viewModelScope.launch {
            saveImageToGallery(imageBytes, fileName).fold(
                onSuccess = { _state.update { it.copy(message = "Image saved to gallery") } },
                onFailure = { error ->
                    _state.update { it.copy(error = error.message ?: "Failed to save image") }
                }
            )
        }
    }

    fun selectRun(id: Long?) {
        _state.update { it.copy(selectedRunId = id) }
    }

    fun openUserPicker(runId: Long) {
        val run = _state.value.runs.find { it.id == runId }
        if (run?.syncStatus == org.trichter.app.features.ble.domain.models.LocalRunSyncStatus.SYNCED) {
            _state.update { it.copy(error = "Cannot change user for a synced run") }
            return
        }

        _state.update {
            it.copy(
                userPickerRunId = runId,
                userQuery = "",
                userResults = emptyList(),
                userLoading = false,
                userError = null,
            )
        }
        userQuery.value = ""
    }

    fun closeUserPicker() {
        _state.update { it.copy(userPickerRunId = null, userQuery = "", userResults = emptyList()) }
        userQuery.value = ""
    }

    fun onUserQueryChange(newValue: String) {
        _state.update { it.copy(userQuery = newValue) }
        userQuery.value = newValue
    }

    fun selectUserForRun(runId: Long, user: UserDto) {
        val run = _state.value.runs.find { it.id == runId }
        if (run?.syncStatus == org.trichter.app.features.ble.domain.models.LocalRunSyncStatus.SYNCED) {
            _state.update { it.copy(error = "Cannot change user for a synced run") }
            return
        }

        val next = _state.value.selectedUsers.toMutableMap()
        next[runId] = user
        _state.update { it.copy(selectedUsers = next, userPickerRunId = null, userQuery = "") }
        userQuery.value = ""
        viewModelScope.launch {
            updateLocalRunUserUseCase(runId, user.id, user.displayName())
        }
    }

    fun selectCurrentUser(runId: Long) {
        viewModelScope.launch {
            _state.update { it.copy(userLoading = true, userError = null) }
            getCurrentUserUseCase().fold(
                onSuccess = { user ->
                    selectUserForRun(runId, user)
                },
                onFailure = { e ->
                    _state.update { it.copy(userLoading = false, userError = e.message) }
                }
            )
        }
    }

    fun dismissError() {
        _state.update { it.copy(error = null) }
    }

    fun dismissMessage() {
        _state.update { it.copy(message = null) }
    }

    private fun observeUserSearch() {
        userQuery
            .debounce(300)
            .map { it.trim() }
            .distinctUntilChanged()
            .flatMapLatest { q ->
                if (q.isBlank()) flowOf(Result.success(emptyList()))
                else flow { emit(searchUsersUseCase(q)) }
            }
            .onEach { _state.update { it.copy(userLoading = true, userError = null) } }
            .catch { e -> _state.update { it.copy(userLoading = false, userError = e.message) } }
            .onEach { result ->
                result.fold(
                    onSuccess = { list ->
                        _state.update { it.copy(userLoading = false, userResults = list, userError = null) }
                    },
                    onFailure = { e ->
                        _state.update { it.copy(userLoading = false, userError = e.message) }
                    }
                )
            }
            .launchIn(viewModelScope)
    }

    private fun UserDto.displayName(): String {
        return name
            ?: displayUsername
            ?: username
            ?: id
    }
}
