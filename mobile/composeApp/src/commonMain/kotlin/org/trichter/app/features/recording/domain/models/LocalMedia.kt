package org.trichter.app.features.recording.domain.models

import kotlin.time.Instant

enum class LocalMediaKind { IMAGE, VIDEO }

enum class LocalMediaSyncStatus { PENDING, SYNCED, FAILED }

data class LocalMedia(
    val id: Long? = null,
    val localRunId: Long,
    val kind: LocalMediaKind,
    val filePath: String,
    val contentType: String,
    val durationMs: Long? = null,
    val width: Int? = null,
    val height: Int? = null,
    val syncStatus: LocalMediaSyncStatus = LocalMediaSyncStatus.PENDING,
    val serverId: String? = null,
    val errorMessage: String? = null,
    val createdAt: Instant = Instant.DISTANT_PAST,
    val updatedAt: Instant = Instant.DISTANT_PAST,
)
