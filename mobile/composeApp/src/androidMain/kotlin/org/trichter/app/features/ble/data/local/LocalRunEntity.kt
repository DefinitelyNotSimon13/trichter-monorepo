package org.trichter.app.features.ble.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "local_runs")
data class LocalRunEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val durationMs: Long,
    val rateLpm: Float,
    val volumeL: Float,
    val imageData: ByteArray? = null,
    val userId: String? = null,
    val userDisplayName: String? = null,
    val syncStatus: String, // "PENDING", "SYNCED", or "FAILED"
    val serverId: String? = null,
    val createdAt: Long, // Timestamp in ms
    val updatedAt: Long, // Timestamp in ms
    val errorMessage: String? = null,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is LocalRunEntity) return false

        if (id != other.id) return false
        if (durationMs != other.durationMs) return false
        if (rateLpm != other.rateLpm) return false
        if (volumeL != other.volumeL) return false
        if (imageData != null) {
            if (other.imageData == null) return false
            if (!imageData.contentEquals(other.imageData)) return false
        } else if (other.imageData != null) return false
        if (userId != other.userId) return false
        if (userDisplayName != other.userDisplayName) return false
        if (syncStatus != other.syncStatus) return false
        if (serverId != other.serverId) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (errorMessage != other.errorMessage) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + durationMs.hashCode()
        result = 31 * result + rateLpm.hashCode()
        result = 31 * result + volumeL.hashCode()
        result = 31 * result + (imageData?.contentHashCode() ?: 0)
        result = 31 * result + (userId?.hashCode() ?: 0)
        result = 31 * result + (userDisplayName?.hashCode() ?: 0)
        result = 31 * result + syncStatus.hashCode()
        result = 31 * result + (serverId?.hashCode() ?: 0)
        result = 31 * result + createdAt.hashCode()
        result = 31 * result + updatedAt.hashCode()
        result = 31 * result + (errorMessage?.hashCode() ?: 0)
        return result
    }
}
