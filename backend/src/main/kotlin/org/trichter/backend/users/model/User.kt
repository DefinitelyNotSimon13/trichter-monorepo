package org.trichter.backend.users.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Index
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.Immutable
import java.time.Instant
import java.time.OffsetDateTime

// Read-only view of BetterAuth's user table. This service never writes to it; all mutations go through BetterAuth.
@Entity
@Immutable
@Table(
    name = "\"user\"", schema = "public", indexes = [
        Index(
            name = "user_username_idkx",
            columnList = "username"
        ),
        Index(
            name = "user_display_username_idkx",
            columnList = "displayUsername"
        )], uniqueConstraints = [
        UniqueConstraint(
            name = "user_email_unique",
            columnNames = ["email"]
        ),
        UniqueConstraint(
            name = "user_username_unique",
            columnNames = ["username"]
        )]
)
open class User {
    @Id
    @Column(name = "id", nullable = false, length = Integer.MAX_VALUE)
    open var id: String = ""

    @NotNull
    @Column(name = "name", nullable = false, length = Integer.MAX_VALUE)
    open var name: String = ""

    @NotNull
    @Column(name = "email", nullable = false, length = Integer.MAX_VALUE)
    open var email: String = ""

    @NotNull
    @Column(name = "\"emailVerified\"", nullable = false)
    open var emailVerified: Boolean = false

    @Column(name = "image", length = Integer.MAX_VALUE)
    open var image: String? = null

    @NotNull
    @Column(name = "\"createdAt\"", nullable = false)
    open var createdAt: Instant = Instant.now()

    @NotNull
    @Column(name = "\"updatedAt\"", nullable = false)
    open var updatedAt: Instant = Instant.now()

    @Column(name = "role", length = Integer.MAX_VALUE)
    open var role: String? = null

    @Column(name = "banned")
    open var banned: Boolean? = null

    @Column(name = "\"banReason\"", length = Integer.MAX_VALUE)
    open var banReason: String? = null

    @Column(name = "\"banExpires\"")
    open var banExpires: Instant? = null

    @NotNull
    @Column(name = "username", nullable = false, length = Integer.MAX_VALUE)
    open var username: String = ""

    @NotNull
    @Column(name = "\"displayUsername\"", nullable = false, length = Integer.MAX_VALUE)
    open var displayUsername: String = ""

    @Column(name = "\"lastActiveAt\"")
    open var lastActiveAt: OffsetDateTime? = null

}