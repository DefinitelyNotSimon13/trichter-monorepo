package org.trichter.app.di

import android.content.Context
import org.koin.android.ext.koin.androidContext
import org.koin.dsl.module

fun androidContextModule(context: Context) = module {
    single<Context> { context }
}
