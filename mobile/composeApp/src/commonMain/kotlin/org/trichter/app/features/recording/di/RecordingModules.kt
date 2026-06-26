package org.trichter.app.features.recording.di

import org.koin.core.module.dsl.factoryOf
import org.koin.dsl.module
import org.trichter.app.features.recording.data.createLocalMediaRepository
import org.trichter.app.features.recording.domain.LocalMediaRepository
import org.trichter.app.features.recording.domain.Recorder
import org.trichter.app.features.recording.domain.VideoOverlayProcessor
import org.trichter.app.features.recording.domain.usecases.AttachRecordedVideoToRun

fun recordingModules() = listOf(recordingDataModule, recordingDomainModule)

val recordingDataModule = module {
    single { Recorder() }
    single { VideoOverlayProcessor() }
    single<LocalMediaRepository> { createLocalMediaRepository() }
}

val recordingDomainModule = module {
    factoryOf(::AttachRecordedVideoToRun)
}
