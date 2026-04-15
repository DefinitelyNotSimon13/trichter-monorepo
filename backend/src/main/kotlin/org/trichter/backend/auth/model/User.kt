package org.trichter.backend.auth.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Index
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.Immutable
import org.trichter.backend.runs.model.Run
import java.time.Instant
@Entity
@Immutable
@Table(
    name = "\"user\"",
    schema = "public",
    indexes = [
        Index(name = "user_username_idkx", columnList = "username"),
        Index(name = "user_display_username_idkx", columnList = "display_username"),
    ],
    uniqueConstraints = [
        UniqueConstraint(name = "user_email_unique", columnNames = ["email"]),
        UniqueConstraint(name = "user_username_unique", columnNames = ["username"]),
    ]
)
class User(

    @Id
    @Column(name = "id", nullable = false, length = Integer.MAX_VALUE)
    var id: String = "",

    @NotNull
    @Column(name = "name", nullable = false, length = Integer.MAX_VALUE)
    var name: String = "",

    @NotNull
    @Column(name = "email", nullable = false, length = Integer.MAX_VALUE)
    var email: String = "",

    @NotNull
    @Column(name = "email_verified", nullable = false)
    var emailVerified: Boolean = false,

    @Column(name = "image", length = Integer.MAX_VALUE)
    var image: String? = null,

    @NotNull
    @Column(name = "created_at", nullable = false)
    var createdAt: Instant = Instant.now(),

    @NotNull
    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now(),

    @Column(name = "role", length = Integer.MAX_VALUE)
    var role: String? = null,

    @Column(name = "banned")
    var banned: Boolean? = null,

    @Column(name = "ban_reason", length = Integer.MAX_VALUE)
    var banReason: String? = null,

    @Column(name = "ban_expires")
    var banExpires: Instant? = null,

    @NotNull
    @Column(name = "username", nullable = false, length = Integer.MAX_VALUE)
    var username: String = "",

    @NotNull
    @Column(name = "display_username", nullable = false, length = Integer.MAX_VALUE)
    var displayUsername: String = "",
) {
    fun toUserInfo(): UserInfo =
        UserInfo(
            id = id,
            name = displayUsername,
            username = username,
            image = image,
        )
}

data class UserInfo(
    val id: String,
    val name: String,
    val username: String,
    val image: String?,
)
