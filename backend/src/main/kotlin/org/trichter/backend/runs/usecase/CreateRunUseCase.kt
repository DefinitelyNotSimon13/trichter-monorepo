package org.trichter.backend.runs.usecase

import org.springframework.context.ApplicationEventPublisher
import org.springframework.transaction.annotation.Transactional
import org.springframework.stereotype.Service
import org.trichter.backend.auth.repository.UserReadRepository
import org.trichter.backend.common.errors.NotFoundException
import org.trichter.backend.realtime.application.OutboundWebSocketPublisher
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

    @Transactional
    operator fun invoke(
        rate: Double,
        volume: Double,
        duration: Double,
        userId: String?,
    ): RunDto {
        val user = userId?.let {
            userReadRepository.findById(userId)
                .orElseThrow { NotFoundException("User $userId not found") }
        }

        val run = Run.create(
            data = MeasurementData(
                rate = rate,
                volume = volume,
                duration = duration
            ),
            user = user,
        )

        val dto = runRepository.save(run).toDto()
        eventPublisher.publishEvent(RunCreatedEvent(dto.id, dto.user?.id))
        return dto
    }
}