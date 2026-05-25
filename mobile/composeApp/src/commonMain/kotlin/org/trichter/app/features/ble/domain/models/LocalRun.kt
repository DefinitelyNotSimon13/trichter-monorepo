package org.trichter.app.features.ble.domain.models

import kotlin.time.Instant

enum class LocalRunSyncStatus {
    PENDING,      // Not yet uploaded to server
    SYNCED,       // Successfully uploaded to server
    FAILED,       // Failed to upload to server
}

data class LocalRun(
    val id: Long? = null,              // Primary key (auto-generated)
    val durationMs: Long,              // Duration in milliseconds
    val rateLpm: Float,                // Rate in L/min
    val volumeL: Float,                // Volume in liters
    val imageData: ByteArray? = null,  // JPEG image bytes
    val userId: String? = null,        // Optional user ID
    val userDisplayName: String? = null, // Optional user display name
    val syncStatus: LocalRunSyncStatus = LocalRunSyncStatus.PENDING,
    val serverId: String? = null,      // ID on server once synced
    val createdAt: Instant = Instant.DISTANT_PAST,
    val updatedAt: Instant = Instant.DISTANT_PAST,
    val errorMessage: String? = null,  // Error message if sync failed
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is LocalRun) return false

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
        var result = id?.hashCode() ?: 0
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
