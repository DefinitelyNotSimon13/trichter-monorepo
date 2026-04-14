package org.trichter.backend.common

import org.springframework.boot.actuate.info.Info
import org.springframework.boot.actuate.info.InfoContributor
import org.springframework.stereotype.Component
import org.trichter.backend.common.config.AppProperties

@Component
class BuildInfoContributor(
    private val appProperties: AppProperties
) : InfoContributor {
    override fun contribute(builder: Info.Builder) {
        builder.withDetail("buildId", appProperties.buildId)
    }

}