package org.trichter.backend.common.auth

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.Immutable
import java.time.Instant

@Entity
@Immutable
@Table(name = "apikey", schema = "public")
open class ApiKey {

    @Id
    @Column(name = "id", nullable = false, length = Integer.MAX_VALUE)
    open var id: String = ""

    @Column(name = "\"referenceId\"", nullable = false, length = Integer.MAX_VALUE)
    open var userId: String = ""

    @Column(name = "key", nullable = false, length = Integer.MAX_VALUE)
    open var key: String = ""

    @Column(name = "enabled")
    open var enabled: Boolean? = null

    @Column(name = "\"expiresAt\"")
    open var expiresAt: Instant? = null
}
