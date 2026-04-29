package org.trichter.app.features.runs.di

import io.ktor.client.HttpClient
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.auth.Auth
import io.ktor.client.plugins.auth.providers.BearerTokens
import io.ktor.client.plugins.auth.providers.bearer
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.websocket.WebSockets
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.bind
import org.koin.dsl.module
import org.trichter.app.features.runs.data.repository.RunsRepository
import org.trichter.app.features.runs.data.repository.RunsRepositoryImpl
import io.ktor.client.plugins.logging.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import org.koin.core.module.dsl.factoryOf
import org.koin.core.module.dsl.viewModelOf
import org.publicvalue.multiplatform.oidc.ExperimentalOpenIdConnect
import org.publicvalue.multiplatform.oidc.OpenIdConnectClient
import org.publicvalue.multiplatform.oidc.ktor.oidcBearer
import org.publicvalue.multiplatform.oidc.tokenstore.TokenRefreshHandler
import org.trichter.api.client.apis.RunsApi
import org.trichter.api.client.apis.UsersApi
import org.trichter.app.di.ApiConfig
import org.trichter.app.features.auth.data.AuthPreferencesTokenStore
import org.trichter.app.features.runs.domain.usecases.GetRuns
import org.trichter.app.features.runs.presentation.LeaderboardViewModel
import org.trichter.app.features.runs.presentation.RunsViewModel
import org.trichter.app.util.KtorLogger

fun runsModule() = listOf(runsPresentationModules, runsDomainModule, runsDataModule)

val runsPresentationModules = module {
    viewModelOf(::RunsViewModel)
    viewModelOf(::LeaderboardViewModel)

}

val runsDomainModule = module {
    factoryOf(::GetRuns)
}

val runsDataModule = module {
    singleOf(::RunsRepositoryImpl).bind<RunsRepository>()

    single {
        RunsApi(
            baseUrl = get<ApiConfig>().baseUrl,
            httpClient = get()
        )
    }

    single {
        UsersApi(
            baseUrl = get<ApiConfig>().baseUrl,
            httpClient = get()
        )
    }

    @OptIn(ExperimentalOpenIdConnect::class)
    single<HttpClient> {
        val tokenStore = get<AuthPreferencesTokenStore>()
        val oidcClient = get<OpenIdConnectClient>()
        val refreshHandler = TokenRefreshHandler(tokenStore)
        HttpClient {
            install(ContentNegotiation) {
                json(Json {
                    ignoreUnknownKeys = true
                    isLenient = true
                    encodeDefaults = false
                })
            }
            install(HttpTimeout) {
                requestTimeoutMillis = 10_000
                connectTimeoutMillis = 5_000
                socketTimeoutMillis = 10_000
            }
            install(Logging) {
                level = LogLevel.ALL
                logger = KtorLogger()
            }
            install(WebSockets)
            install(Auth) {
                bearer {
                    //TODO: AHH
                    loadTokens {
                        BearerTokens(tokenStore.getIdToken() ?: error("No id token"), tokenStore.getRefreshToken())
                    }
                    refreshTokens {
                        val tokens = refreshHandler.refreshAndSaveToken(oidcClient, tokenStore.getAccessToken() ?: error("No access token"))
                        BearerTokens(tokens.idToken ?: error("No id token"), tokens.refreshToken)
                    }
                }
            }
        }
    }

}
