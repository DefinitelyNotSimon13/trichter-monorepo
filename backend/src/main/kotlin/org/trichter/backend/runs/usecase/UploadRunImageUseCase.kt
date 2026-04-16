package org.trichter.backend.runs.usecase

import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import org.trichter.backend.realtime.application.RealtimeAudience
import org.trichter.backend.realtime.application.RealtimeEvent
import org.trichter.backend.runs.model.RunDto
import org.trichter.backend.runs.model.toDto
import org.trichter.backend.runs.repository.RunRepository
import org.trichter.backend.runs.repository.findByIdOrThrow
import org.trichter.backend.runs.storage.ImageStorage
import java.time.Instant
import java.util.UUID

data class RunImageUploadedEvent(
    val runId: UUID,
    val imageUrl: String,
    override val occurredAt: Instant = Instant.now(),
) : RealtimeEvent<RunImageUploadedEvent.Payload> {

    override val type: String = "run.image-uploaded"

    override val audience: RealtimeAudience = RealtimeAudience.All


    override val payload: Payload
        get() = Payload(
            runId = runId.toString(),
            imageUrl = imageUrl,
        )

    data class Payload(
        val runId: String,
        val imageUrl: String,
    )
}

@Service
class UploadRunImageUseCase(
    private val runRepository: RunRepository,
    private val imageStorage: ImageStorage,
    private val applicationEventPublisher: ApplicationEventPublisher ,
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @Transactional
    operator fun invoke(
        runId: UUID,
        bytes: ByteArray,
        contentType: String,
    ): RunDto {
        val run = runRepository.findByIdOrThrow(runId)

        if (!run.image.isNullOrEmpty()) {
            log.error("Run '$runId' already has an image.")
            throw IllegalStateException("Run '$runId' already has an image.")
        }

        val imageRef = imageStorage.putRunImage(
            runId = runId,
            bytes = bytes,
            contentType = contentType,
        )

        run.image = imageRef.into()

        val saved = runRepository.save(run)
        val dto = saved.toDto()

        applicationEventPublisher.publishEvent(
            RunImageUploadedEvent(
                runId = dto.id,
                imageUrl = dto.image ?: error("Saved run image must not be null"),
            )
        )

        return dto
    }
}