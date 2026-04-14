package org.trichter.backend.common.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(AppProperties::class)
class AppConfig

@ConfigurationProperties(prefix = "app")
data class AppProperties(
    val buildId: String
)