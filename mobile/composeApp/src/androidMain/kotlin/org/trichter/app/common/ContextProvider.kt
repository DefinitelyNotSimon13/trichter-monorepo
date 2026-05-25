package org.trichter.app.common

import android.content.Context

object ContextProvider {
    var applicationContext: Context? = null
        private set

    fun initialize(context: Context) {
        applicationContext = context.applicationContext
    }
}
