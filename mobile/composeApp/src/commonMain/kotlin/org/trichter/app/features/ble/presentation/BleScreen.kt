@file:OptIn(ExperimentalUuidApi::class)

package org.trichter.app.features.ble.presentation


import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.juul.kable.Identifier
import com.juul.kable.ManufacturerData
import com.juul.kable.PlatformAdvertisement
import dev.icerock.moko.permissions.PermissionState
import kotlinx.collections.immutable.persistentMapOf
import org.trichter.app.features.ble.domain.models.Connection
import org.trichter.app.features.ble.domain.models.ConnectionState
import org.trichter.app.features.ble.domain.models.DeviceId
import org.trichter.app.features.ble.domain.models.ImageStatus
import org.trichter.app.features.ble.domain.models.ImageTransferState
import org.trichter.app.features.ble.domain.models.ResultMeta
import org.trichter.app.features.ble.domain.models.SessionStatus
import org.trichter.app.features.ble.domain.models.TrichterState
import org.trichter.app.features.ble.presentation.views.BleConnectScreen
import org.trichter.app.features.ble.presentation.views.BleConnectedScreen
import org.trichter.app.features.ble.presentation.views.BlePermissionsScreen
import kotlin.collections.mapOf
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@Composable
fun BleScreen(viewModel: BleViewModel) {
   val uiState by viewModel.state.collectAsStateWithLifecycle()
    val searchUserState by viewModel.searchUserState.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(uiState.permissionState) {
        if (uiState.permissionState == PermissionState.Granted) viewModel.startScan()
    }

    LaunchedEffect(Unit) {
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
                    onConnectClick = { viewModel.connect(it) }
                )

                uiState.connectionState == ConnectionState.Connecting -> BleConnectingScreen()

                uiState.connectionState == ConnectionState.Connected -> BleConnectedScreen(
                    trichterState = uiState.trichterState!!,
                    runSaved = uiState.runSaved,
                    onDisconnect = { viewModel.disconnect() },
                    onAck = { viewModel.sendAck() },
                    onReset = { viewModel.onReset() },
                    onFakeRun = { viewModel.onFakeRun() },
                    onSaveRun = { meta: ResultMeta -> viewModel.saveRun(meta) },
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
