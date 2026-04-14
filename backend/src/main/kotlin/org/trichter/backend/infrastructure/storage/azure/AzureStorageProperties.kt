package org.trichter.backend.infrastructure.storage.azure

import org.springframework.boot.context.properties.ConfigurationProperties
import java.time.Duration

@ConfigurationProperties(prefix = "app.storage.azure")
data class AzureStorageProperties(
    val containerName: String,
    val keyPrefix: String = "runs",
    val signedUrlTtl: Duration = Duration.ofMinutes(15),
)