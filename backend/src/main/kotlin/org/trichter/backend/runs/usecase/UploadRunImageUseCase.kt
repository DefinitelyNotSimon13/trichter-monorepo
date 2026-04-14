package org.trichter.backend.runs.usecase

import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.trichter.backend.common.errors.NotFoundException
import org.trichter.backend.runs.model.RunView
import org.trichter.backend.runs.repository.RunRepository
import org.trichter.backend.runs.repository.findByIdOrThrow
import org.trichter.backend.runs.storage.ImageStorage
import java.util.UUID

@Service
class UploadRunImageUseCase(
    private val runRepository: RunRepository,
    private val imageStorage: ImageStorage
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @Transactional
    operator fun invoke(
        runId: UUID,
        bytes: ByteArray,
        contentType: String,
    ): RunView {
        val run = runRepository.findByIdOrThrow(runId)

        if(!run.image.isEmpty()) {
            log.error("Run '$runId' already has an image.")
            //TODO: Better exception
            throw RuntimeException("Run '$runId' already has an image.")
        }

        val imageRef = imageStorage.putRunImage(
            runId = runId,
            bytes = bytes,
            contentType = contentType,
        )

        run.image = imageRef.into();

        return runRepository.save(run).toView()

    }

}