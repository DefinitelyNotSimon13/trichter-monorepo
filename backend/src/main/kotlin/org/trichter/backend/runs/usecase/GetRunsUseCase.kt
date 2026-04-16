package org.trichter.backend.runs.usecase

import org.springframework.data.domain.Pageable
import org.springframework.transaction.annotation.Transactional
import org.springframework.stereotype.Service
import org.trichter.backend.runs.model.toDto
import org.trichter.backend.runs.repository.RunRepository

@Service
class GetRunsUseCase(
    private val runRepository: RunRepository,
) {
    @Transactional(readOnly = true)
    operator fun invoke(pageable: Pageable) =
        runRepository.findAll(pageable)
            .map { it.toDto() }
}