package org.trichter.backend.runs.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.ColumnDefault
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction
import org.trichter.backend.auth.model.User
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "runs", schema = "public")
open class Run(
    @Id
    @ColumnDefault("gen_random_uuid()")
    @Column(name = "id", nullable = false)
    open var id: UUID? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "\"userId\"")
    open var user: User? = null,

    @NotNull
    @Column(name = "rate", nullable = false)
    open var rate: Double = 0.0,

    @NotNull
    @Column(name = "volume", nullable = false)
    open var volume: Double = 0.0,

    @NotNull
    @Column(name = "duration", nullable = false)
    open var duration: Double = 0.0,

    @Column(name = "image", length = Integer.MAX_VALUE)
    open var image: String? = null,

    @NotNull
    @ColumnDefault("now()")
    @Column(name = "\"createdAt\"", nullable = false)
    open var createdAt: OffsetDateTime = OffsetDateTime.now(),

    @NotNull
    @ColumnDefault("now()")
    @Column(name = "\"lastModifiedAt\"", nullable = false)
    open var lastModifiedAt: OffsetDateTime = OffsetDateTime.now(),

    @NotNull
    @Column(name = "version", nullable = false)
    open var version: Long = 0L,
) {
    companion object {
        fun create(data: MeasurementData, user: User?) = Run(
            rate = data.rate,
            volume = data.volume,
            duration = data.duration,
            user = user,
        )
    }
}

