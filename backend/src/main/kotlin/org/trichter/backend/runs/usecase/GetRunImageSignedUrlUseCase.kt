package org.trichter.backend.runs.usecase

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.trichter.backend.common.errors.NotFoundException
import org.trichter.backend.infrastructure.storage.azure.AzureStorageProperties
import org.trichter.backend.runs.repository.RunRepository
import org.trichter.backend.runs.repository.findByIdOrThrow
import org.trichter.backend.runs.storage.ImageStorage
import org.trichter.backend.runs.storage.SignedImageUrl
import org.trichter.backend.runs.storage.into
import java.util.UUID

@Service
class GetRunImageSignedUrlUseCase(
    private val runRepository: RunRepository,
    private val imageStorage: ImageStorage,
    private val storageProperties: AzureStorageProperties
) {
    @Transactional(readOnly = true)
    operator fun invoke(runId: UUID): SignedImageUrl {
        val run = runRepository.findByIdOrThrow(runId)

        val imageRef = run.image?.into()
            ?: throw NotFoundException("Run '$runId' has no image")

        return imageStorage.generateSignedUrl(
            imageRef = imageRef,
            ttl = storageProperties.signedUrlTtl,
        )
    }
}