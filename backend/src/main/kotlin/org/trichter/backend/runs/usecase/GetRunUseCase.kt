package org.trichter.backend.runs.usecase

import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.trichter.backend.common.errors.NotFoundException
import org.trichter.backend.runs.model.RunView
import org.trichter.backend.runs.repository.RunRepository
import org.trichter.backend.runs.repository.findByIdOrThrow
import java.util.UUID

@Service
class GetRunUseCase(
    private val runRepository: RunRepository,
) {
    @Transactional(readOnly = true)
    operator fun invoke(id: UUID): RunView {
        val run = runRepository.findByIdOrThrow(id);

        return run.toView()
    }
}