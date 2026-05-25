package org.trichter.app.features.ble.data.local

import android.content.Context
import org.trichter.app.features.ble.domain.LocalRunsRepository
import org.trichter.app.common.ContextProvider

actual fun createLocalRunsRepository(): LocalRunsRepository {
    val context = ContextProvider.applicationContext
        ?: throw IllegalStateException("Application context not initialized")
    val db = LocalRunsDatabase.getInstance(context)
    return AndroidLocalRunsRepositoryImpl(db.localRunDao())
}




