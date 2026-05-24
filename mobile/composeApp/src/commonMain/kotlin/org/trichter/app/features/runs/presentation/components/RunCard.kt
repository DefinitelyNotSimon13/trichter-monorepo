@file:OptIn(ExperimentalTime::class)

package org.trichter.app.features.runs.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import nl.jacobras.humanreadable.HumanReadable
import org.trichter.app.features.runs.domain.model.Run
import org.trichter.app.util.Log
import kotlin.time.ExperimentalTime
import kotlin.time.Instant

@Composable
fun RunCard(
    run: Run,
    modifier: Modifier = Modifier,
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceContainer,
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Column {
            run.image?.let {
                AsyncImage(
                    //TODO: Hardcoded URL
                    model = "https://trichter.hauptspeicher.com/api/v2/runs/${run.id}/image",
                    contentDescription = null,
                    contentScale = ContentScale.FillWidth,
                    modifier = Modifier.fillMaxWidth(),
                )
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                RunMetric(label = "Rate", value = run.data?.rate, unit = "L/min", modifier = Modifier.weight(1f))
                RunMetric(label = "Volume", value = run.data?.volume, unit = "L", modifier = Modifier.weight(1f))
                RunMetric(label = "Duration", value = run.data?.duration, unit = "s", modifier = Modifier.weight(1f))
            }

            // Footer
            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
            RunCardFooter(run = run)
        }
    }
}

@Composable
private fun RunMetric(
    label: String,
    value: Double?,
    unit: String,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .background(MaterialTheme.colorScheme.surfaceContainerHigh)
            .padding(horizontal = 10.dp, vertical = 10.dp),
    ) {
        Text(
            text = label.uppercase(),
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            letterSpacing = 1.2.sp,
        )
        Row(
            verticalAlignment = Alignment.Bottom,
            horizontalArrangement = Arrangement.spacedBy(3.dp),
            modifier = Modifier.padding(top = 4.dp),
        ) {
            Text(
                text = value?.toFixed(2) ?: "—",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Black,
                color = MaterialTheme.colorScheme.primary,
            )
            Text(
                text = unit,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

@Composable
private fun RunCardFooter(run: Run) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 10.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            // Avatar
            val displayName = run.user?.name ?: "Unknown"
            val initial = displayName.firstOrNull()?.uppercaseChar()?.toString() ?: "?"
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .background(MaterialTheme.colorScheme.primaryContainer, CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = initial,
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                )
            }
            Text(
                text = displayName,
                style = MaterialTheme.typography.bodySmall,
                fontWeight = FontWeight.SemiBold,
            )
        }

        run.createdAt?.let { createdAt ->
            runCatching { Instant.parse(createdAt) }.getOrNull()?.let { instant ->
                Text(
                    text = HumanReadable.timeAgo(instant),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

// Reused from the existing implementation
private val POW10: LongArray = longArrayOf(
    1L, 10L, 100L, 1_000L, 10_000L, 100_000L, 1_000_000L,
    10_000_000L, 100_000_000L, 1_000_000_000L,
    10_000_000_000L, 100_000_000_000L, 1_000_000_000_000L,
    10_000_000_000_000L, 100_000_000_000_000L, 1_000_000_000_000_000L,
    10_000_000_000_000_000L, 100_000_000_000_000_000L, 1_000_000_000_000_000_000L
)

private fun roundHalfAwayFromZero(x: Double): Long =
    if (x >= 0.0) kotlin.math.floor(x + 0.5).toLong()
    else kotlin.math.ceil(x - 0.5).toLong()

fun Double.toFixed(decimals: Int): String {
    require(decimals >= 0 && decimals < POW10.size)
    val pow = POW10[decimals].toDouble()
    val scaled = roundHalfAwayFromZero(this * pow)
    val sign = if (scaled < 0) "-" else ""
    val absScaled = kotlin.math.abs(scaled)
    val intPart = (absScaled / POW10[decimals]).toString()
    return if (decimals == 0) {
        "$sign$intPart"
    } else {
        val fracPart = (absScaled % POW10[decimals]).toString().padStart(decimals, '0')
        "$sign$intPart.$fracPart"
    }
}

expect fun decodeImage(bytes: ByteArray): androidx.compose.ui.graphics.ImageBitmap?
