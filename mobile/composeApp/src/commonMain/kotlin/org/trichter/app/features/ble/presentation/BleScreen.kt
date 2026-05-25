package org.trichter.app.features.ble.presentation


import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import dev.icerock.moko.permissions.PermissionState
import org.trichter.app.features.ble.domain.models.ConnectionState
import org.trichter.app.features.ble.presentation.views.BleConnectScreen
import org.trichter.app.features.ble.presentation.views.BleConnectedScreen
import org.trichter.app.features.ble.presentation.views.BlePermissionsScreen
import org.trichter.app.util.Log

@Composable
fun BleScreen(viewModel: BleViewModel) {
    val uiState by viewModel.state.collectAsStateWithLifecycle()
    val searchUserState by viewModel.searchUserState.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }

    Log.i("BleScreen", "Recomposing BleScreen with state: $uiState")

    // Use a stable key to ensure snackbar collection only happens once per screen lifecycle
    LaunchedEffect(viewModel) {
        viewModel.snackbar.collect { message ->
            snackbarHostState.showSnackbar(message)
        }
    }

    LaunchedEffect(uiState.permissionState) {
        if (uiState.permissionState == PermissionState.Granted) viewModel.startScan()
    }

    LaunchedEffect(viewModel) {
        viewModel.disconnectEvent.collect {
            snackbarHostState.showSnackbar("Disconnected from device")
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
    ) { innerPadding ->
        Box(Modifier.padding(innerPadding)) {
            when {
                uiState.permissionState != PermissionState.Granted -> BlePermissionsScreen(
                    permissionState = uiState.permissionState,
                    onRequestPermissions = { viewModel.onRequestPermissions() },
                    onOpenSettings = { viewModel.onOpenSettings() },
                )

                uiState.connectionState == ConnectionState.Disconnected -> BleConnectScreen(
                    advertisements = uiState.advertisements.values.toList(),
                    onConnectClick = { viewModel.stopScan(); viewModel.connect(it) }
                )

                uiState.connectionState == ConnectionState.Connecting -> BleConnectingScreen()

                uiState.connectionState == ConnectionState.Connected -> BleConnectedScreen(
                    trichterState = uiState.trichterState!!,
                    isSaving = uiState.isSaving,
                    runSaved = uiState.runSaved,
                    onDisconnect = { viewModel.disconnect() },
                    onAck = { viewModel.sendAck() },
                    onReset = { viewModel.onReset() },
                    onFakeRun = { viewModel.onFakeRun() },
                    onSaveRun = {  viewModel.saveRun() },
                    searchUserState = searchUserState,
                    onQueryChange = viewModel::onQueryChange,
                    onUserClick = { viewModel.onUserClick(it) },
                    onClearUser = { viewModel.onClearUser() },
                    onSelectSelf = { viewModel.onSelectSelf() },
                )

                uiState.error != null -> ErrorView(uiState.error!!) { viewModel.startScan() }
            }
        }
    }
}


@Composable
private fun ErrorView(error: Throwable, onRetry: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Something went wrong", style = MaterialTheme.typography.titleMedium)
        error.message?.let {
            Text(it, color = MaterialTheme.colorScheme.error)
        }
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Button(onClick = onRetry) { Text("Retry scan") }
        }
    }
}

@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
private fun BleConnectingScreen(
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        LoadingIndicator(
            modifier = Modifier
                .size(100.dp)
        )
        Text("Connecting", style = MaterialTheme.typography.bodyMediumEmphasized)
    }

}

@Preview
@Composable
fun ConnectingPreview() {
    BleConnectingScreen()
}
