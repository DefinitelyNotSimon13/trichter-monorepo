package org.trichter.backend.runs.usecase

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.trichter.backend.runs.model.RunView
import org.trichter.backend.runs.repository.RunRepository

@Service
class GetRunsByUserUseCase(
    private val runRepository: RunRepository
) {
    @Transactional(readOnly = true)
    operator fun invoke(userId: String, pageable: Pageable): Page<RunView> =
        runRepository.findAllByUser_Id(userId, pageable)
    .map { it.toView() }
}