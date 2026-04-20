package org.trichter.app.features.websocket.di

import org.koin.dsl.module
import org.trichter.app.features.websocket.TrichterWebSocketService
import org.trichter.app.features.websocket.TrichterWebSocketServiceImpl

val webSocketModule = module {
    single<TrichterWebSocketService> {
        TrichterWebSocketServiceImpl(
            httpClient = get(),
            config = get(),
            authRepository = get(),
        )
    }
}

fun wsModules() = listOf(webSocketModule)
