package org.trichter.backend.runs.repository

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.trichter.backend.common.errors.NotFoundException
import org.trichter.backend.runs.model.Run
import java.util.Optional
import java.util.UUID

interface RunRepository : JpaRepository<Run, UUID> {
    fun findAllByUserId(userId: String, pageable: Pageable): Page<Run>
    override fun findById(id: UUID): Optional<Run>
}

fun RunRepository.findByIdOrThrow(id: UUID): Run {
    return findById(id).orElseThrow { NotFoundException("Run '$id' not found") }
}