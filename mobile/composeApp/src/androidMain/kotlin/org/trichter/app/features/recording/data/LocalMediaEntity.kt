package org.trichter.app.features.recording.data

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "local_media",
    indices = [Index("localRunId")],
)
data class LocalMediaEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val localRunId: Long,
    val kind: String, // "IMAGE" or "VIDEO"
    val filePath: String,
    val contentType: String,
    val durationMs: Long? = null,
    val width: Int? = null,
    val height: Int? = null,
    val syncStatus: String, // "PENDING", "SYNCED", or "FAILED"
    val serverId: String? = null,
    val errorMessage: String? = null,
    val createdAt: Long,
    val updatedAt: Long,
)
