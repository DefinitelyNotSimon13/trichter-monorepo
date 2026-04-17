package org.trichter.backend.runs.usecase

import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.trichter.backend.runs.model.RunDto
import org.trichter.backend.runs.model.toDto
import org.trichter.backend.runs.repository.RunRepository

@Service
class GetRunsByUserUseCase(
    private val runRepository: RunRepository
) {

    private val log = LoggerFactory.getLogger(javaClass)

    @Transactional(readOnly = true)
    operator fun invoke(userId: String, pageable: Pageable): Page<RunDto> {
        log.debug("Fetching runs for userId={}, pageable={}", userId, pageable)
        return runRepository.findAllByUserId(userId, pageable).map { it.toDto() }
    }
}