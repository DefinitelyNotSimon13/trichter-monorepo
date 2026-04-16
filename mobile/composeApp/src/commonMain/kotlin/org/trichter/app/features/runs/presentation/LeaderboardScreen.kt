package org.trichter.app.features.runs.presentation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import org.trichter.app.features.runs.data.model.Run
import org.trichter.app.features.runs.presentation.components.toFixed

@Composable
fun LeaderboardScreen(viewModel: LeaderboardViewModel) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    when {
        uiState.isLoading -> {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        }

        uiState.errorMessage != null -> {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.padding(32.dp),
                ) {
                    Text("Couldn't load leaderboard", style = MaterialTheme.typography.titleMedium)
                    Text(
                        uiState.errorMessage ?: "",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                    )
                    TextButton(onClick = viewModel::load) { Text("Try again") }
                }
            }
        }

        uiState.entries.isEmpty() -> {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("No runs yet", color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }

        else -> {
            LeaderboardTable(entries = uiState.entries)
        }
    }
}

@Composable
private fun LeaderboardTable(entries: List<Run>) {
    // Column headers
    LazyColumn(modifier = Modifier.fillMaxSize()) {
        item {
            LeaderboardHeader()
            HorizontalDivider()
        }
        itemsIndexed(entries) { index, run ->
            LeaderboardRow(rank = index + 1, run = run)
            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
        }
        item { Box(Modifier.height(8.dp)) }
    }
}

@Composable
private fun LeaderboardHeader() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.surfaceContainerHigh)
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            text = "#",
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.widthIn(min = 36.dp),
        )
        Text(
            text = "Name",
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.weight(1f),
        )
        Text(
            text = "Flow",
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.widthIn(min = 64.dp),
            textAlign = TextAlign.End,
        )
        Text(
            text = "Vol",
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.widthIn(min = 56.dp),
            textAlign = TextAlign.End,
        )
    }
}

@Composable
private fun LeaderboardRow(rank: Int, run: Run) {
    val rankColor = when (rank) {
        1 -> MaterialTheme.colorScheme.tertiary          // gold
        2 -> MaterialTheme.colorScheme.onSurfaceVariant  // silver
        3 -> MaterialTheme.colorScheme.secondary         // bronze
        else -> MaterialTheme.colorScheme.onSurfaceVariant
    }
    val rankWeight = if (rank <= 3) FontWeight.Bold else FontWeight.Normal

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            text = "$rank",
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = rankWeight,
            color = rankColor,
            modifier = Modifier.widthIn(min = 36.dp),
        )
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = run.user?.name ?: "Unknown",
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            run.user?.username?.let {
                Text(
                    text = "@$it",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        Text(
            text = run.data?.rate?.toFixed(1)?.let { "$it L/m" } ?: "—",
            style = MaterialTheme.typography.bodyMedium,
            color = if (rank == 1) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface,
            fontWeight = if (rank == 1) FontWeight.Bold else FontWeight.Normal,
            modifier = Modifier.widthIn(min = 64.dp),
            textAlign = TextAlign.End,
        )
        Text(
            text = run.data?.volume?.toFixed(2)?.let { "${it}L" } ?: "—",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.widthIn(min = 56.dp),
            textAlign = TextAlign.End,
        )
    }
}
