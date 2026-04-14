package org.trichter.backend.runs.model

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import jakarta.persistence.Version
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import org.hibernate.type.SqlTypes
import org.trichter.backend.auth.model.User
import org.trichter.backend.auth.model.UserInfo
import java.time.Instant
import java.util.UUID


@Entity
@Table(name = "runs")
class Run(
    @Id @GeneratedValue(strategy = GenerationType.UUID) @Column(
        name = "id",
        nullable = false,
        updatable = false
    ) var id: UUID? = null,

    @ManyToOne(fetch = FetchType.LAZY) @OnDelete(action = OnDeleteAction.RESTRICT) @JoinColumn(name = "user_id") var user: User? = null,

    @NotNull @JdbcTypeCode(SqlTypes.JSON) @Column(
        name = "data",
        nullable = false,
        columnDefinition = "jsonb"
    ) var data: MeasurementData,

    @NotNull @Column(name = "image", nullable = false) var image: String = "",

    @NotNull @Column(name = "created_at", nullable = false, updatable = false) var createdAt: Instant = Instant.now(),

    @Version var version: Long = 0
) {
    fun toView(): RunView = RunView(
        id = requireNotNull(id),
        user = user?.toUserInfo(),
        data = data,
        hasImage = !image.isEmpty(),
        imageUrl = if (!image.isEmpty()) "/api/v2/runs/${requireNotNull(id)}/image" else null,
        createdAt = createdAt
    )

    companion object {
        fun create(data: MeasurementData, user: User?): Run = Run(
            data = data,
            user = user,
        )
    }
}

@Embeddable
data class MeasurementData(
    var rate: Double,
    var volume: Double,
    var duration: Double,
)

data class RunView(
    val id: UUID,
    val user: UserInfo?,
    val data: MeasurementData,
    val hasImage: Boolean,
    val imageUrl: String?,
    val createdAt: Instant
)