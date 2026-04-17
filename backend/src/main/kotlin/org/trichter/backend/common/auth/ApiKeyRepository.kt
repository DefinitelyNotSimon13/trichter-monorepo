package org.trichter.backend.common.auth

import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface ApiKeyRepository : JpaRepository<ApiKey, String> {
    fun findByKey(key: String): Optional<ApiKey>
}
