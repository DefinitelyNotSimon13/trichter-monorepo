package org.trichter.app.features.runs.domain.model

import kotlinx.serialization.Serializable
import org.trichter.api.client.models.RunDto
import kotlin.time.ExperimentalTime

fun RunDto.toRun() = Run(
    id = requireNotNull(id),
    userId = user?.id,
    data = RunData(
        rate = rate,
        duration = duration,
        volume = volume
    ),
    image = image,
    createdAt = createdAt?.toString(),
    user = user?.let {
        User(
            id = requireNotNull(it.id),
            name = it.displayUsername,
            username = it.username,
            image = null
        )
    }
)

@Serializable
data class Run @OptIn(ExperimentalTime::class) constructor(
    val id: String,
    val userId: String? = null,
    val data: RunData? = null,
    val image: String? = null,
    val createdAt: String? = null,
    val user: User? = null,
)

@Serializable
data class RunData(
    val duration: Double? = null,
    val rate: Double? = null,
    val volume: Double? = null,
)

@Serializable
data class User(
    val id: String,
    val name: String? = null,
    val username: String? = null,
    val image: String? = null,
)

@Serializable
data class PagedResult<T>(
    val content: List<T> = emptyList(),
    val page: PageMetadata? = null,
)

@Serializable
data class PageMetadata(
    val size: Long = 0,
    val number: Long = 0,
    val totalElements: Long = 0,
    val totalPages: Long = 0,
)
