@file:OptIn(ExperimentalMaterial3Api::class)

package org.trichter.app.features.ble.presentation.views

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import org.trichter.app.features.ble.domain.models.Connection
import org.trichter.app.features.ble.domain.models.ImageStatus
import org.trichter.app.features.ble.domain.models.ImageTransferState
import org.trichter.app.features.ble.domain.models.ResultMeta
import org.trichter.app.features.ble.domain.models.SessionStatus
import org.trichter.app.features.ble.domain.models.TrichterState
import org.trichter.app.features.ble.domain.models.UserDto
import org.trichter.app.features.ble.presentation.SearchUserState
import org.trichter.app.isDevMode
import kotlin.math.pow
import kotlin.math.round

@Composable
fun BleConnectedScreen(
    trichterState: TrichterState,
    runSaved: Boolean,
    searchUserState: SearchUserState,
    onQueryChange: (String) -> Unit,
    onUserClick: (UserDto) -> Unit,
    onClearUser: () -> Unit,
    onSelectSelf: () -> Unit,
    onDisconnect: () -> Unit,
    onAck: () -> Unit,
    onReset: () -> Unit,
    onFakeRun: () -> Unit,
    onSaveRun: (ResultMeta) -> Unit,
    onSaveImage: (ByteArray) -> Unit = {},
    modifier: Modifier = Modifier,
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Trichter") },
                actions = {
                    IconButton(onClick = onDisconnect) {
                        Icon(Icons.Outlined.Close, contentDescription = "Disconnect")
                    }
                }
            )
        }
    ) { inner ->
        Column(
            modifier
                .padding(inner)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp, 0.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                ConnectionChip(trichterState.connection)
                StatusChip(trichterState.status)
            }

            if (false) {
                DevPanel(onFakeRun = onFakeRun)
            }

            when (trichterState.status) {
                SessionStatus.WAITING -> WaitingPanel()
                SessionStatus.RUNNING -> RunningPanel()
                SessionStatus.COMPLETE -> {
                    val meta = trichterState.lastResultMeta
                    if (meta != null) {
                        CompletePanel(
                            trichterState = trichterState,
                            runSaved = runSaved,
                            searchUserState = searchUserState,
                            onQueryChange = onQueryChange,
                            onUserClick = onUserClick,
                            onClearUser = onClearUser,
                            onSelectSelf = onSelectSelf,
                            onSaveRun = onSaveRun,
                            onAck = onAck,
                        )
                    } else {
                        IdlePanel(trichterState, modifier)
                    }
                }
                SessionStatus.ERROR -> ErrorPanel(onReset = onReset)
                SessionStatus.IDLE, SessionStatus.UNKNOWN -> IdlePanel(trichterState, modifier)
            }
        }
    }
}

@Composable
private fun DevPanel(onFakeRun: () -> Unit, modifier: Modifier = Modifier) {
    OutlinedCard(modifier = modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp).fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                SuggestionChip(
                    onClick = {},
                    label = { Text("Dev", style = MaterialTheme.typography.labelSmall) },
                    enabled = false,
                )
                Text("Testing tools", style = MaterialTheme.typography.bodyMedium)
            }
            FilledTonalButton(onClick = onFakeRun) {
                Icon(Icons.Outlined.PlayArrow, contentDescription = null)
                Spacer(Modifier.width(6.dp))
                Text("Fake Run")
            }
        }
    }
}

@Composable
private fun IdlePanel(trichterState: TrichterState, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainer)
    ) {
        Row(
            modifier = Modifier.padding(20.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            when(trichterState.connection) {
                Connection.Connected -> {
                    Icon(
                        Icons.Outlined.CheckCircle,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(28.dp)
                    )
                    Column {
                        Text("Device ready", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                        Text(
                            "Waiting for session to start",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                Connection.Disconnected , Connection.Connecting ->  {
                    Icon(
                        Icons.Outlined.RemoveCircle,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.error,
                        modifier = Modifier.size(28.dp)
                    )
                    Column {
                        Text("Device not ready", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                        Text(
                            "Ensure Trichter is connected properly",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun WaitingPanel(modifier: Modifier = Modifier) {
    PulsingRingPanel(
        label = "Waiting for flow\u2026",
        color = MaterialTheme.colorScheme.tertiary,
        periodMs = 2000,
        staggerMs = 667,
        modifier = modifier,
    )
}

@Composable
private fun RunningPanel(modifier: Modifier = Modifier) {
    PulsingRingPanel(
        label = "Measuring\u2026",
        color = MaterialTheme.colorScheme.primary,
        periodMs = 1200,
        staggerMs = 400,
        modifier = modifier,
    )
}

@Composable
private fun PulsingRingPanel(
    label: String,
    color: Color,
    periodMs: Int,
    staggerMs: Int,
    modifier: Modifier = Modifier,
) {
    val transition = rememberInfiniteTransition(label = "pulse")

    val alpha1 by transition.animateFloat(
        initialValue = 0.6f, targetValue = 0f,
        animationSpec = infiniteRepeatable(tween(periodMs, easing = LinearEasing), RepeatMode.Restart),
        label = "a1"
    )
    val scale1 by transition.animateFloat(
        initialValue = 0.3f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(periodMs, easing = LinearEasing), RepeatMode.Restart),
        label = "s1"
    )
    val alpha2 by transition.animateFloat(
        initialValue = 0.6f, targetValue = 0f,
        animationSpec = infiniteRepeatable(tween(periodMs, delayMillis = staggerMs, easing = LinearEasing), RepeatMode.Restart),
        label = "a2"
    )
    val scale2 by transition.animateFloat(
        initialValue = 0.3f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(periodMs, delayMillis = staggerMs, easing = LinearEasing), RepeatMode.Restart),
        label = "s2"
    )
    val alpha3 by transition.animateFloat(
        initialValue = 0.6f, targetValue = 0f,
        animationSpec = infiniteRepeatable(tween(periodMs, delayMillis = staggerMs * 2, easing = LinearEasing), RepeatMode.Restart),
        label = "a3"
    )
    val scale3 by transition.animateFloat(
        initialValue = 0.3f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(periodMs, delayMillis = staggerMs * 2, easing = LinearEasing), RepeatMode.Restart),
        label = "s3"
    )

    Column(
        modifier = modifier.fillMaxWidth().padding(top = 48.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Box(contentAlignment = Alignment.Center, modifier = Modifier.size(140.dp)) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val maxRadius = size.minDimension / 2f
                val strokePx = 3.dp.toPx()
                drawCircle(color = color, radius = maxRadius * scale1, alpha = alpha1, style = Stroke(strokePx))
                drawCircle(color = color, radius = maxRadius * scale2, alpha = alpha2, style = Stroke(strokePx))
                drawCircle(color = color, radius = maxRadius * scale3, alpha = alpha3, style = Stroke(strokePx))
            }
            Icon(
                Icons.Outlined.WaterDrop,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(36.dp)
            )
        }
        Text(label, style = MaterialTheme.typography.titleMedium, color = color, fontWeight = FontWeight.Medium)
    }
}

@Composable
private fun CompletePanel(
    trichterState: TrichterState,
    runSaved: Boolean,
    searchUserState: SearchUserState,
    onQueryChange: (String) -> Unit,
    onUserClick: (UserDto) -> Unit,
    onClearUser: () -> Unit,
    onSelectSelf: () -> Unit,
    onSaveRun: (ResultMeta) -> Unit,
    onAck: () -> Unit,
    modifier: Modifier = Modifier,
) {
    var showAckDialog by remember { mutableStateOf(false) }

    if (showAckDialog) {
        AlertDialog(
            onDismissRequest = { showAckDialog = false },
            icon = { Icon(Icons.Outlined.Warning, contentDescription = null) },
            title = { Text("Run not saved") },
            text = { Text("Acknowledging without saving will discard the measurement data. Continue?") },
            confirmButton = {
                TextButton(onClick = {
                    showAckDialog = false
                    onAck()
                }) { Text("Acknowledge") }
            },
            dismissButton = {
                TextButton(onClick = { showAckDialog = false }) { Text("Cancel") }
            }
        )
    }

    Card(
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainer)
    ) {
        val imageBytes = trichterState.lastImage
        val meta = trichterState.lastResultMeta!!
        val transferring = trichterState.imageStatus == ImageStatus.TRANSFERRING

        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            // Image area
            if (imageBytes?.isNotEmpty() == true) {
                val bitmap: ImageBitmap? = remember(imageBytes) { decodeImage(imageBytes) }
                if (bitmap != null) {
                    Image(
                        bitmap = bitmap,
                        contentDescription = "Session image",
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(min = 160.dp)
                            .clip(MaterialTheme.shapes.extraLarge)
                    )
                } else {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Outlined.Face, contentDescription = null)
                        Text("${imageBytes.size} bytes (preview unavailable)", color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            } else {
                NoImagePanel(trichterState)
            }

            Column(
                modifier = Modifier.padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text("Result", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)

                // Metrics
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Metric(
                        title = "Duration",
                        value = formatDuration(meta.durationMs),
                        supporting = "s",
                        modifier = Modifier.weight(1f)
                    )
                    Metric(
                        title = "Rate",
                        value = meta.rateLpm.clean(2),
                        supporting = "L/min",
                        modifier = Modifier.weight(1f)
                    )
                    Metric(
                        title = "Volume",
                        value = meta.volumeL.clean(2),
                        supporting = "L",
                        modifier = Modifier.weight(1f)
                    )
                }

                // User selection
                val selected = searchUserState.selectedUser
                if (selected != null) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(Icons.Outlined.Person, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        AssistChip(
                            onClick = {},
                            label = { Text(selected.displayUsername ?: selected.name ?: "Unknown") },
                        )
                        Spacer(Modifier.weight(1f))
                        TextButton(onClick = onClearUser) { Text("Change") }
                    }
                } else {
                    UsersSearchScreen(
                        searchUserState = searchUserState,
                        onQueryChange = onQueryChange,
                        onUserClick = onUserClick,
                        onSelectSelf = onSelectSelf,
                    )
                }

                // Action buttons
                Column(
                    modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (selected == null && !runSaved) {
                        Text(
                            "Assign a user to save this run",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Button(
                            onClick = { onSaveRun(meta) },
                            enabled = !transferring && !runSaved && selected != null,
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(0),
                        ) {
                            if (runSaved) {
                                Icon(Icons.Outlined.CheckCircle, contentDescription = null)
                            } else {
                                Icon(Icons.Outlined.Check, contentDescription = null)
                            }
                            Spacer(Modifier.width(6.dp))
                            Text(if (runSaved) "Saved" else "Save Run")
                        }
                        OutlinedButton(
                            onClick = {
                                if (!runSaved) showAckDialog = true else onAck()
                            },
                            enabled = !transferring,
                            modifier = Modifier.weight(1f),
                                    shape = RoundedCornerShape(0),
                        ) {
                            Icon(Icons.Outlined.Send, contentDescription = null)
                            Spacer(Modifier.width(6.dp))
                            Text("Acknowledge")
                        }
                    }
                    if (transferring) {
                        Text(
                            "Waiting for image transfer\u2026",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
private fun NoImagePanel(
    trichterState: TrichterState,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = Modifier.padding(horizontal = 16.dp).padding(top = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if(trichterState.imageStatus == ImageStatus.NONE) {
            Icon(
                Icons.Default.Close,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text("No image", color = MaterialTheme.colorScheme.onSurfaceVariant)
        } else if(trichterState.imageStatus == ImageStatus.TRANSFERRING) {
            Icon(
                Icons.Default.Download,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Column {
                Text("Retrieving Image\u2026", color = MaterialTheme.colorScheme.onSurfaceVariant)
                LinearWavyProgressIndicator()
            }
        } else {
            Text("WTF?", color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun ErrorPanel(onReset: () -> Unit, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer)
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Icon(
                    Icons.Outlined.Warning,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onErrorContainer,
                    modifier = Modifier.size(24.dp)
                )
                Text(
                    "Session Error",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onErrorContainer
                )
            }
            Text(
                "An error occurred during the measurement session. Reset the device to try again.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onErrorContainer
            )
            Button(
                onClick = onReset,
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
            ) {
                Icon(Icons.Outlined.Refresh, contentDescription = null)
                Spacer(Modifier.width(6.dp))
                Text("Reset Device")
            }
        }
    }
}

@Composable
private fun ConnectionChip(connection: Connection, modifier: Modifier = Modifier) {
    val (label, color) = when (connection) {
        Connection.Connected -> "Connected" to MaterialTheme.colorScheme.primary
        Connection.Connecting -> "Connecting\u2026" to MaterialTheme.colorScheme.tertiary
        Connection.Disconnected -> "Disconnected" to MaterialTheme.colorScheme.error
    }
    AssistChip(
        onClick = {},
        label = { Text(label) },
        enabled = false,
        modifier = modifier,
        colors = AssistChipDefaults.assistChipColors(
            disabledContainerColor = color.copy(alpha = 0.16f),
            disabledLabelColor = color
        )
    )
}

@Composable
private fun StatusChip(status: SessionStatus, modifier: Modifier = Modifier) {
    val (label, color) = when (status) {
        SessionStatus.IDLE -> "Idle" to MaterialTheme.colorScheme.outline
        SessionStatus.WAITING -> "Waiting" to MaterialTheme.colorScheme.tertiary
        SessionStatus.RUNNING -> "Running" to MaterialTheme.colorScheme.primary
        SessionStatus.COMPLETE -> "Complete" to MaterialTheme.colorScheme.secondary
        SessionStatus.ERROR -> "Error" to MaterialTheme.colorScheme.error
        SessionStatus.UNKNOWN -> "Unknown" to MaterialTheme.colorScheme.onSurfaceVariant
    }
    SuggestionChip(
        onClick = {},
        label = { Text(label) },
        enabled = false,
        modifier = modifier,
        colors = SuggestionChipDefaults.suggestionChipColors(
            disabledContainerColor = color.copy(alpha = 0.16f),
            disabledLabelColor = color
        )
    )
}

@Composable
private fun Metric(
    title: String,
    value: String,
    supporting: String,
    modifier: Modifier = Modifier
) {
    ElevatedCard(
        modifier = modifier,
        colors = CardDefaults.elevatedCardColors(
            containerColor = MaterialTheme.colorScheme.surfaceContainerHigh
        )
    ) {
        Column(
            Modifier.padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                title,
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                value,
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
            Text(
                supporting,
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun UsersSearchScreen(
    searchUserState: SearchUserState,
    onQueryChange: (String) -> Unit,
    onUserClick: (UserDto) -> Unit,
    onSelectSelf: () -> Unit = {},
) {
    Column(Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            OutlinedTextField(
                value = searchUserState.query,
                onValueChange = onQueryChange,
                modifier = Modifier.weight(1f),
                label = { Text("Search users") },
                singleLine = true,
                leadingIcon = { Icon(Icons.Outlined.Search, null) }
            )
            FilledTonalButton(onClick = onSelectSelf, shape = RoundedCornerShape(0), modifier = Modifier.padding(vertical = 0.dp).fillMaxHeight()) {
                Icon(Icons.Outlined.Person, contentDescription = null)
                Spacer(Modifier.width(4.dp))
                Text("Me")
            }
        }

        if (searchUserState.loading) {
            LinearProgressIndicator(Modifier.fillMaxWidth().padding(top = 8.dp))
        }

        searchUserState.error?.let { err ->
            Text(
                err,
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        Column(
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            searchUserState.results.forEach { user ->
                ElevatedCard(
                    onClick = { onUserClick(user) },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(Modifier.padding(12.dp)) {
                        Text(
                            user.displayUsername ?: user.name ?: "Unknown",
                            style = MaterialTheme.typography.titleMedium
                        )
                        val handle = user.username?.let { "@$it" }
                        if (!handle.isNullOrBlank()) {
                            Text(
                                handle,
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun NoImagePanelPreview() {
    var transferred by remember { mutableIntStateOf(0) }
    val total = 100

    LaunchedEffect(Unit) {
        while (true) {
            transferred = (transferred + 1) % (total + 1)
            kotlinx.coroutines.delay(50)
        }
    }

    CompletePanel(
        trichterState = TrichterState(
            connection = Connection.Connected,
            status = SessionStatus.IDLE,
            imageStatus = ImageStatus.TRANSFERRING,
            lastResultMeta = ResultMeta(
                durationMs = 1000,
                rateLpm = 5.5f,
                volumeL = 1.4f,
                hasImage = true,
                imageSize = 5000,
            ),
            lastImage = null,
            imageTransferState = ImageTransferState(
                total,
                transferred
            )
        ),
        runSaved = false,
        searchUserState = SearchUserState(),
        onQueryChange = {},
        onUserClick = {},
        onClearUser = {},
        onSelectSelf = {},
        onSaveRun = {},
        onAck = {},
    )
}


private fun Long.msToSeconds(): String = (this / 1000.0).clean(2)
private fun formatDuration(ms: Long): String = ms.msToSeconds()

private fun formatFloatCommon(value: Double, digits: Int): String {
    val multiplier = 10.0.pow(digits)
    val rounded = round(value * multiplier) / multiplier
    val parts = rounded.toString().split('.')
    return if (digits == 0) {
        parts[0]
    } else {
        val frac = parts.getOrNull(1)?.padEnd(digits, '0')?.take(digits) ?: "".padEnd(digits, '0')
        "${parts[0]}.$frac"
    }
}

fun Double.clean(digits: Int): String = formatFloatCommon(this, digits)
fun Float.clean(digits: Int): String = formatFloatCommon(this.toDouble(), digits)

expect fun decodeImage(bytes: ByteArray): ImageBitmap?
