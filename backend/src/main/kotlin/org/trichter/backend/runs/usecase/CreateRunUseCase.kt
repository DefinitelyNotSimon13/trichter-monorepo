package org.trichter.backend.runs.usecase

import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher
import org.springframework.transaction.annotation.Transactional
import org.springframework.stereotype.Service
import org.trichter.backend.users.repository.UserReadRepository
import org.trichter.backend.common.errors.NotFoundException
import org.trichter.backend.realtime.application.RealtimeAudience
import org.trichter.backend.realtime.application.RealtimeEvent
import org.trichter.backend.runs.model.MeasurementData
import org.trichter.backend.runs.model.Run
import org.trichter.backend.runs.model.RunDto
import org.trichter.backend.runs.model.toDto
import org.trichter.backend.runs.repository.RunRepository
import java.time.Instant
import java.util.UUID

data class RunCreatedEvent(
    val runId: UUID,
    val userId: String?,
    override val occurredAt: Instant = Instant.now(),
) : RealtimeEvent<RunCreatedEvent.Payload> {

    override val type: String = "run.created"

    override val audience: RealtimeAudience =
        RealtimeAudience.All

    override val payload: Payload
        get() = Payload(
            runId = runId.toString(),
            userId = userId,
        )

    data class Payload(
        val runId: String,
        val userId: String?,
    )
}

@Service
class CreateRunUseCase(
    private val runRepository: RunRepository,
    private val userReadRepository: UserReadRepository,
    private val eventPublisher: ApplicationEventPublisher,
) {

    private val log = LoggerFactory.getLogger(javaClass)

    @Transactional
    operator fun invoke(
        rate: Double,
        volume: Double,
        duration: Double,
        userId: String,
        createdById: String,
    ): RunDto {
        val assignedUser = userReadRepository.findById(userId)
            .orElseThrow { NotFoundException("User $userId not found") }

        val createdBy = userReadRepository.findById(createdById)
            .orElseThrow { NotFoundException("User $createdById not found") }

        val run = Run.create(
            data = MeasurementData(
                rate = rate,
                volume = volume,
                duration = duration
            ),
            user = assignedUser,
            createdBy = createdBy,
        )

        val dto = runRepository.save(run).toDto()
        log.info("Run {} created, userId={}, createdById={}", dto.id, userId, createdById)
        eventPublisher.publishEvent(RunCreatedEvent(dto.id, dto.user?.id))
        return dto
    }
}
