package org.trichter.backend.runs.usecase

import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.trichter.backend.users.repository.UserReadRepository
import org.trichter.backend.common.errors.NotFoundException
import org.trichter.backend.realtime.application.RealtimeAudience
import org.trichter.backend.realtime.application.RealtimeEvent
import org.trichter.backend.runs.model.RunDto
import org.trichter.backend.runs.model.toDto
import org.trichter.backend.runs.repository.RunRepository
import org.trichter.backend.runs.repository.findByIdOrThrow
import java.time.Instant
import java.util.UUID

data class RunUserUpdatedEvent(
    val runId: UUID,
    val userId: String?,
    override val occurredAt: Instant = Instant.now(),
) : RealtimeEvent<RunUserUpdatedEvent.Payload> {

    override val type: String = "run.user-updated"

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
class UpdateRunUserUseCase(
    private val runRepository: RunRepository,
    private val userReadRepository: UserReadRepository,
    private val applicationEventPublisher: ApplicationEventPublisher,
) {

    private val log = LoggerFactory.getLogger(javaClass)

    @Transactional
    operator fun invoke(
        runId: UUID,
        userId: String,
    ): RunDto {
        val run = runRepository.findByIdOrThrow(runId)

        val user = userReadRepository.findById(userId)
            .orElseThrow { NotFoundException("User $userId not found") }

        run.user = user

        val saved = runRepository.save(run)
        val dto = saved.toDto()

        log.info("Run {} reassigned to userId={}", runId, userId)
        applicationEventPublisher.publishEvent(
            RunUserUpdatedEvent(
                runId = dto.id,
                userId = dto.user?.id,
            )
        )

        return dto
    }
}