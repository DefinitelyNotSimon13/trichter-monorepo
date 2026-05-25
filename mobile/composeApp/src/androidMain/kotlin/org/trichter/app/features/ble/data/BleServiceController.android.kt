package org.trichter.app.features.ble.data

import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.trichter.app.service.BleConnectionService

actual class BleServiceController actual constructor() : KoinComponent {
    private val context: Context by inject()

    actual fun start() {
        ContextCompat.startForegroundService(context, Intent(context, BleConnectionService::class.java))
    }

    actual fun stop() {
        context.stopService( Intent(context, BleConnectionService::class.java))
    }
}
