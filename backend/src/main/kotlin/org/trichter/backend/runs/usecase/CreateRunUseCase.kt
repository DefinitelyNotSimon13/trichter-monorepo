package org.trichter.backend.runs.usecase

import org.springframework.transaction.annotation.Transactional
import org.springframework.stereotype.Service
import org.trichter.backend.auth.repository.UserReadRepository
import org.trichter.backend.common.errors.NotFoundException
import org.trichter.backend.runs.model.MeasurementData
import org.trichter.backend.runs.model.Run
import org.trichter.backend.runs.model.RunView
import org.trichter.backend.runs.repository.RunRepository

@Service
class CreateRunUseCase(
    private val runRepository: RunRepository,
    private val userReadRepository: UserReadRepository
) {

    @Transactional
    operator fun invoke(
        rate: Double,
        volume: Double,
        duration: Double,
        userId: String?,
    ): RunView {
        val user = userId?.let {
            userReadRepository.findById(userId)
                .orElseThrow { NotFoundException("User $userId not found") }
        }

        val run = Run.create(
            data = MeasurementData(
                rate = rate,
                volume = volume,
                duration = duration
            ),
            user = user,
        )

        return runRepository.save(run).toView()
    }
}