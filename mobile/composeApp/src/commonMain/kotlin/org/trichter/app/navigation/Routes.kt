package org.trichter.app.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Bluetooth
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material.icons.outlined.WaterDrop
import androidx.compose.ui.graphics.vector.ImageVector

enum class Routes(val route: String, val title: String, val icon: ImageVector) {
    RUNS(route = "runs", title = "Runs", icon = Icons.Outlined.WaterDrop),
    BLE(route = "ble", title = "Connect", icon = Icons.Outlined.Bluetooth),
    SETTINGS(route = "settings", title = "Settings", icon = Icons.Outlined.Settings),
}
