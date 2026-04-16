package org.trichter.backend.runs.usecase

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.trichter.backend.runs.model.RunDto
import org.trichter.backend.runs.model.toDto
import org.trichter.backend.runs.repository.RunRepository
import org.trichter.backend.runs.repository.findByIdOrThrow
import java.util.UUID

@Service
class GetRunUseCase(
    private val runRepository: RunRepository,
) {
    @Transactional(readOnly = true)
    operator fun invoke(id: UUID): RunDto {
        val run = runRepository.findByIdOrThrow(id);

        return run.toDto()
    }
}