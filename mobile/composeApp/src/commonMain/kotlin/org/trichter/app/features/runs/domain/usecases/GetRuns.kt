package org.trichter.app.features.runs.domain.usecases

import com.juul.kable.PlatformAdvertisement
import org.trichter.app.features.ble.domain.BleRepository
import org.trichter.app.features.runs.data.repository.RunsRepository
import org.trichter.app.features.runs.data.repository.map
import org.trichter.app.features.runs.domain.model.Run
import org.trichter.app.features.runs.domain.model.toRun
import org.trichter.app.features.runs.data.repository.Result

class GetRuns(private val repo: RunsRepository) {
    suspend operator fun invoke(
        page: Int,
        size: Int
    ): Result<Pair<List<Run>, Boolean>> =
        repo.getRuns(page, size)
            .map { (runs, hasNext) ->
                runs.map { it.toRun() } to hasNext
            }

    suspend operator fun invoke(
        page: Int,
    ): Result<Pair<List<Run>, Boolean>> =
        repo.getRuns(page)
            .map { (runs, hasNext) ->
                runs.map { it.toRun() } to hasNext
            }
}
