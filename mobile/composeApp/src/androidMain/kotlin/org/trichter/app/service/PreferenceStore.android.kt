package org.trichter.app.service

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences

private lateinit var storedApplicationContext: Context

// Process-level singleton — DataStore forbids multiple instances for the same file.
// This lazy delegate ensures only one instance is ever created per process lifetime,
// regardless of how many times Koin re-initializes.
private val dataStoreInstance: DataStore<Preferences> by lazy {
    val path = getPreferencesDataStorePath(storedApplicationContext)
    getPreferencesDataStore(path)
}

fun initPreferencesDataStore(appContext: Context) {
    storedApplicationContext = appContext
}

fun getPreferencesDataStorePath(appContext: Context): String =
    appContext.filesDir.resolve(dataStoreFileName).absolutePath

actual fun createPreferencesDataStore(): DataStore<Preferences> = dataStoreInstance
