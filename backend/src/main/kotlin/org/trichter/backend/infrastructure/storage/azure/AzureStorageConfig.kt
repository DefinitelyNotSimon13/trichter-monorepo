package org.trichter.backend.infrastructure.storage.azure

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(AzureStorageProperties::class)
class AzureStorageConfig