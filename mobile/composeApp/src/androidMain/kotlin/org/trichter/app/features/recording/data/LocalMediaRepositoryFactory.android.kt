package org.trichter.app.features.recording.data

import org.trichter.app.common.ContextProvider
import org.trichter.app.features.ble.data.local.LocalRunsDatabase
import org.trichter.app.features.recording.domain.LocalMediaRepository

actual fun createLocalMediaRepository(): LocalMediaRepository {
    val context = ContextProvider.applicationContext
        ?: throw IllegalStateException("Application context not initialized")
    val db = LocalRunsDatabase.getInstance(context)
    return AndroidLocalMediaRepository(db.localMediaDao())
}
