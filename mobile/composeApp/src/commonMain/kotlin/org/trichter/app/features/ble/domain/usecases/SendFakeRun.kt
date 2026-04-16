package org.trichter.app.features.ble.domain.usecases

import org.trichter.app.features.ble.domain.BleRepository

class SendFakeRun(private val repo: BleRepository) {
    suspend operator fun invoke() = repo.sendFakeRun()
}
