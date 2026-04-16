package org.trichter.app.features.runs.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.trichter.app.features.runs.data.model.Run
import org.trichter.app.features.runs.data.repository.Result
import org.trichter.app.features.runs.data.repository.RunsRepository

data class LeaderboardUiState(
    val entries: List<Run> = emptyList(),
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
)

class LeaderboardViewModel(
    private val repository: RunsRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(LeaderboardUiState(isLoading = true))
    val uiState: StateFlow<LeaderboardUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun load() {
        viewModelScope.launch {
            _uiState.value = LeaderboardUiState(isLoading = true)
            when (val result = repository.getRuns(page = 0, size = 100)) {
                is Result.Success -> _uiState.value = LeaderboardUiState(
                    entries = result.data.first.sortedByDescending { it.data?.rate },
                )
                is Result.Error -> _uiState.value = LeaderboardUiState(
                    errorMessage = result.exception.message ?: "Unknown error",
                )
                Result.Loading -> Unit
            }
        }
    }
}
