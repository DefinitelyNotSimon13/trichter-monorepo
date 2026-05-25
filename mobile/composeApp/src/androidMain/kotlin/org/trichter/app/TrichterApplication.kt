package org.trichter.app

import android.app.Application
import org.trichter.app.common.ContextProvider

class TrichterApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        ContextProvider.initialize(this)
    }
}
