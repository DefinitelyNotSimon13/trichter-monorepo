package org.trichter.app.features.ble.data.local

import org.trichter.app.features.ble.domain.LocalRunsRepository

internal actual fun createLocalRunsRepository(): LocalRunsRepository {
    return IosLocalRunsRepositoryImpl()
}
