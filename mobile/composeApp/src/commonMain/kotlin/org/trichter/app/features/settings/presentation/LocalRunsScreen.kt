package org.trichter.app.features.settings.presentation

import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.outlined.Download
import androidx.compose.material.icons.outlined.Sync
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import org.koin.compose.viewmodel.koinViewModel
import org.trichter.app.features.ble.domain.models.LocalRun
import org.trichter.app.features.ble.domain.models.LocalRunSyncStatus
import kotlin.math.round
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.layout.ContentScale
import org.trichter.app.features.runs.presentation.components.decodeImage
import org.trichter.app.features.ble.domain.models.UserDto
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.TextButton
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.foundation.layout.heightIn
import androidx.compose.material3.ListItem
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilledTonalButton
import nl.jacobras.humanreadable.HumanReadable

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LocalRunsScreen(
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: LocalRunsViewModel = koinViewModel(),
) {
    val state = viewModel.state.collectAsState()
    val snackbarHostState = remember { SnackbarHostState() }
    val uiState = state.value
    var pendingDelete by remember { mutableStateOf<LocalRun?>(null) }

    if (pendingDelete != null) {
        AlertDialog(
            onDismissRequest = { pendingDelete = null },
            title = { Text("Delete local run?") },
            text = { Text("This will remove the local run and its image from this device.") },
            confirmButton = {
                TextButton(
                    onClick = {
                        pendingDelete?.id?.let { viewModel.deleteRun(it) }
                        pendingDelete = null
                    }
                ) { Text("Delete") }
            },
            dismissButton = {
                TextButton(onClick = { pendingDelete = null }) { Text("Cancel") }
            }
        )
    }

    LaunchedEffect(state.value.error) {
        state.value.error?.let { error ->
            snackbarHostState.showSnackbar(error)
            viewModel.dismissError()
        }
    }

    LaunchedEffect(state.value.message) {
        state.value.message?.let { message ->
            snackbarHostState.showSnackbar(message)
            viewModel.dismissMessage()
        }
    }

    UserPickerDialog(
        isOpen = uiState.userPickerRunId != null,
        query = uiState.userQuery,
        results = uiState.userResults,
        isLoading = uiState.userLoading,
        error = uiState.userError,
        onQueryChange = viewModel::onUserQueryChange,
        onDismiss = viewModel::closeUserPicker,
        onSelectUser = { user ->
            val runId = uiState.userPickerRunId ?: return@UserPickerDialog
            viewModel.selectUserForRun(runId, user)
        },
        onSelectCurrent = {
            val runId = uiState.userPickerRunId ?: return@UserPickerDialog
            viewModel.selectCurrentUser(runId)
        }
    )

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            TopAppBar(
                title = { Text("Local Runs") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        },
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) }
    ) { paddingValues ->
        if (state.value.isLoading && state.value.runs.isEmpty()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                CircularProgressIndicator()
            }
        } else if (state.value.runs.isEmpty()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    "No local runs yet",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(horizontal = 8.dp),
            ) {
                items(state.value.runs) { run ->
                    val selectedUser = uiState.selectedUsers[run.id]
                    val canEditUser = run.syncStatus != LocalRunSyncStatus.SYNCED
                    LocalRunItem(
                        run = run,
                        selectedUser = selectedUser,
                        canEditUser = canEditUser,
                        onDelete = { pendingDelete = run },
                        onSelect = { viewModel.selectRun(run.id) },
                        onSync = { viewModel.syncRun(run) },
                        onSaveImage = { viewModel.saveImage(run) },
                        onSelectUser = { if (canEditUser) viewModel.openUserPicker(run.id!!) },
                    )
                    HorizontalDivider()
                }
            }
        }
    }
}

@Composable
private fun LocalRunItem(
    run: LocalRun,
    selectedUser: UserDto?,
    canEditUser: Boolean,
    onDelete: () -> Unit,
    onSelect: () -> Unit,
    onSync: () -> Unit,
    onSaveImage: () -> Unit,
    onSelectUser: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val imageBitmap: ImageBitmap? = remember(run.imageData) {
        run.imageData?.let { decodeImage(it) }
    }

    val statusColor = when (run.syncStatus) {
        LocalRunSyncStatus.SYNCED -> MaterialTheme.colorScheme.primary
        LocalRunSyncStatus.PENDING -> MaterialTheme.colorScheme.tertiaryContainer
        LocalRunSyncStatus.FAILED -> MaterialTheme.colorScheme.errorContainer
    }

    val statusText = when (run.syncStatus) {
        LocalRunSyncStatus.SYNCED -> "Synced"
        LocalRunSyncStatus.PENDING -> "Pending"
        LocalRunSyncStatus.FAILED -> "Failed"
    }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onSelect)
            .padding(vertical = 8.dp, horizontal = 8.dp),
        shape = MaterialTheme.shapes.medium
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            if (imageBitmap != null) {
                Image(
                    bitmap = imageBitmap,
                    contentDescription = "Run image",
                    modifier = Modifier
                        .width(96.dp)
                        .height(72.dp)
                        .padding(end = 12.dp),
                    contentScale = ContentScale.Crop,
                )
            }
            Column(modifier = Modifier.weight(1f)) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "${run.rateLpm.formatOneDecimal()} L",
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.Bold,
                    )

                    Text(
                        text = "${run.volumeL.formatOneDecimal()} L/min",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )

                    Text(
                        text = "${run.durationMs / 1000} s",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                Spacer(modifier = Modifier.size(4.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        color = statusColor,
                        shape = MaterialTheme.shapes.small
                    ) {
                        Text(
                            text = statusText,
                            style = MaterialTheme.typography.labelSmall,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }
                if (run.syncStatus == LocalRunSyncStatus.FAILED && !run.errorMessage.isNullOrBlank()) {
                    Spacer(modifier = Modifier.size(4.dp))
                    Text(
                        text = run.errorMessage,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.error,
                    )
                }
                Spacer(modifier = Modifier.size(4.dp))

                    Text(
                        text = HumanReadable.timeAgo(run.createdAt),
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                Spacer(modifier = Modifier.size(4.dp))
                val userLabel = when {
                    !run.userId.isNullOrBlank() -> "User: ${run.userId}"
                    selectedUser != null -> "User: ${selectedUser.displayName()}"
                    else -> "User: not set"
                }
                    Text(
                        text = userLabel,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                if (run.userId.isNullOrBlank() && canEditUser && run.id != null) {
                    TextButton(onClick = onSelectUser) { Text("Assign user") }
                }
             }
            Column(horizontalAlignment = Alignment.End) {
                if (run.syncStatus != LocalRunSyncStatus.SYNCED) {
                    IconButton(onClick = onSync) {
                        Icon(
                            Icons.Outlined.Sync,
                            contentDescription = "Sync run",
                        )
                    }
                }
                if (run.imageData != null) {
                    IconButton(onClick = onSaveImage) {
                        Icon(
                            Icons.Outlined.Download,
                            contentDescription = "Save image",
                        )
                    }
                }
                IconButton(onClick = onDelete) {
                    Icon(
                        Icons.Filled.Delete,
                        contentDescription = "Delete",
                        tint = MaterialTheme.colorScheme.error
                    )
                }
            }
        }
    }
}

@Composable
private fun UserPickerDialog(
    isOpen: Boolean,
    query: String,
    results: List<UserDto>,
    isLoading: Boolean,
    error: String?,
    onQueryChange: (String) -> Unit,
    onSelectUser: (UserDto) -> Unit,
    onSelectCurrent: () -> Unit,
    onDismiss: () -> Unit,
) {
    if (!isOpen) return

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Assign user") },
        text = {
            Column( modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = query,
                    onValueChange = onQueryChange,
                    label = { Text("Assign user") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth().padding(bottom = 2.dp)
                )

                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainerLow)
                ) {
                    LazyColumn(
                        modifier = Modifier.heightIn(max = 280.dp)
                    ) {
                        items(results) { user ->
                            ListItem(
                                headlineContent = { Text(user.displayName()) },
                                supportingContent = {
                                    user.username?.let { Text(it) }
                                },
                                modifier = Modifier.clickable { onSelectUser(user) }
                            )
                            HorizontalDivider()
                        }
                        if (query.isNotEmpty() && results.isEmpty() && !isLoading) {
                            item {
                                Text(
                                    "No users found",
                                    modifier = Modifier.padding(16.dp).fillMaxWidth(),
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }
                    }
                }
                TextButton(onClick = onSelectCurrent) { Text("Use my account") }
                if (isLoading) {
                    Text("Searching...")
                }
                if (!error.isNullOrBlank()) {
                    Text(error, color = MaterialTheme.colorScheme.error)
                }
             }
         },
         confirmButton = {
             TextButton(onClick = onDismiss) { Text("Close") }
         }
     )
 }

private fun UserDto.displayName(): String {
    return name
        ?: displayUsername
        ?: username
        ?: id
}

fun Float.formatOneDecimal(): String {
    val rounded = round(this * 10.0) / 10.0
    return rounded.toString()
}