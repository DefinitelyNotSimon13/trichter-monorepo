package org.trichter.app.features.runs.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.trichter.app.features.runs.domain.model.Run
import org.trichter.app.features.runs.data.repository.Result
import org.trichter.app.features.runs.data.repository.RunsRepository
import org.trichter.app.features.runs.domain.usecases.GetRuns
import org.trichter.app.util.Log

data class RunsUiState(
    val runs: List<Run> = emptyList(),
    val isLoading: Boolean = false,
    val isLoadingMore: Boolean = false,
    val isRefreshing: Boolean = false,
    val errorMessage: String? = null,
    val hasMore: Boolean = true,
    val currentPage: Int = 0,
)

class RunsViewModel(
    private val getRunsUseCase: GetRuns
) : ViewModel() {

    private val _uiState = MutableStateFlow(RunsUiState())
    val uiState: StateFlow<RunsUiState> = _uiState.asStateFlow()

    init {
        loadInitial()
    }

    private fun loadInitial() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            when (val result =  getRunsUseCase(page = 0)) {
                is Result.Success -> _uiState.update {
                    it.copy(
                        runs = result.data.first,
                        hasMore = result.data.second,
                        currentPage = 0,
                        isLoading = false,
                    )
                }
                is Result.Error -> _uiState.update {
                    Log.e("RUNS", "Couldnt load runs: ${result.exception}")
                    it.copy(isLoading = false, errorMessage = result.exception.message ?: "Unknown error")
                }
                Result.Loading -> Unit
            }
        }
    }

    fun loadMore() {
        val state = _uiState.value
        if (!state.hasMore || state.isLoadingMore || state.isLoading) return
        viewModelScope.launch {
            val nextPage = state.currentPage + 1
            _uiState.update { it.copy(isLoadingMore = true) }
            when (val result = getRunsUseCase(page = nextPage)) {
                is Result.Success -> _uiState.update {
                    it.copy(
                        runs = it.runs + result.data.first,
                        hasMore = result.data.second,
                        currentPage = nextPage,
                        isLoadingMore = false,
                    )
                }
                is Result.Error -> _uiState.update {
                    it.copy(isLoadingMore = false, errorMessage = result.exception.message ?: "Unknown error")
                }
                Result.Loading -> Unit
            }
        }
    }

    fun refresh() {
        viewModelScope.launch {
            _uiState.update { it.copy(isRefreshing = true, errorMessage = null) }
            when (val result = getRunsUseCase(page = 0)) {
                is Result.Success -> _uiState.update {
                    it.copy(
                        runs = result.data.first,
                        hasMore = result.data.second,
                        currentPage = 0,
                        isRefreshing = false,
                    )
                }
                is Result.Error -> _uiState.update {
                    it.copy(isRefreshing = false, errorMessage = result.exception.message ?: "Unknown error")
                }
                Result.Loading -> Unit
            }
        }
    }

    fun retry() = loadInitial()
}
