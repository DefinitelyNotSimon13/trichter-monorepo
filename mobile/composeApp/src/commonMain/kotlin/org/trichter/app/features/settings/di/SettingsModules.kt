package org.trichter.app.features.settings.di

import org.koin.core.module.dsl.viewModelOf
import org.koin.dsl.module
import org.trichter.app.features.settings.presentation.LocalRunsViewModel

fun settingsModule() = module {
    viewModelOf(::LocalRunsViewModel)
}

