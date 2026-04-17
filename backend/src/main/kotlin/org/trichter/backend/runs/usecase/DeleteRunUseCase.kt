package org.trichter.backend.runs.usecase

import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.trichter.backend.realtime.application.RealtimeAudience
import org.trichter.backend.realtime.application.RealtimeEvent
import org.trichter.backend.runs.repository.RunRepository
import org.trichter.backend.runs.repository.findByIdOrThrow
import org.trichter.backend.runs.storage.ImageStorage
import org.trichter.backend.runs.storage.into
import java.time.Instant
import java.util.UUID

data class RunDeletedEvent(
    val runId: UUID,
    override val occurredAt: Instant = Instant.now(),
) : RealtimeEvent<RunDeletedEvent.Payload> {

    override val type: String = "run.deleted"

    override val audience: RealtimeAudience =
        RealtimeAudience.All

    override val payload: Payload
        get() = Payload(
            runId = runId.toString(),
        )

    data class Payload(
        val runId: String,
    )
}

@Service
class DeleteRunUseCase(
    private val runRepository: RunRepository,
    private val imageStorage: ImageStorage,
    private val applicationEventPublisher: ApplicationEventPublisher,
) {

    private val log = LoggerFactory.getLogger(javaClass)

    @Transactional
    operator fun invoke(runId: UUID) {
        log.info("Deleting run {}", runId)
        val run = runRepository.findByIdOrThrow(runId)

        run.image?.into()?.let(imageStorage::delete)

        runRepository.delete(run)

        applicationEventPublisher.publishEvent(
            RunDeletedEvent(runId = runId)
        )
    }
}