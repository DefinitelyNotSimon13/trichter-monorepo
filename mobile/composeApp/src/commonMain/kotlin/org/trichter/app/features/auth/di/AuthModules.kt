package org.trichter.app.features.auth.di

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import org.koin.core.module.dsl.viewModel
import org.koin.dsl.module
import org.publicvalue.multiplatform.oidc.OpenIdConnectClient
import org.publicvalue.multiplatform.oidc.appsupport.CodeAuthFlowFactory
import org.publicvalue.multiplatform.oidc.types.CodeChallengeMethod
import org.trichter.app.features.auth.data.AuthPreferences
import org.trichter.app.features.auth.data.OidcAuthRepository
import org.trichter.app.features.auth.domain.AuthRepository
import org.trichter.app.features.auth.domain.usecases.InitializeAuth
import org.trichter.app.features.auth.domain.usecases.Login
import org.trichter.app.features.auth.domain.usecases.Logout
import org.trichter.app.features.auth.domain.usecases.ObserveAuthState

fun authModules() = listOf(
    module {
        single {
            OpenIdConnectClient(
                discoveryUri = "https://next.trichter.hauptspeicher.com/.well-known/openid-configuration"
            ) {
                clientId = "oNcRqjIhVYutaWUODwHgNOBfZYwkODxz"
                scope = "openid profile offline_access"
                codeChallengeMethod = CodeChallengeMethod.S256
                redirectUri = "trichter://oauth/callback"
            }
        }

        single {
            AuthPreferences(
                dataStore = get<DataStore<Preferences>>()
            )
        }

        single<AuthRepository> {
            OidcAuthRepository(
                oidcClient = get<OpenIdConnectClient>(),
                codeAuthFlowFactory = get<CodeAuthFlowFactory>(),
                authPreferences = get<AuthPreferences>(),
            )
        }

        factory { ObserveAuthState(get()) }
        factory { InitializeAuth(get()) }
        factory { Login(get()) }
        factory { Logout(get()) }

        viewModel {
            org.trichter.app.features.auth.presentation.AuthViewModel(
                observeAuthState = get(),
                initializeAuthUseCase = get(),
                loginUseCase = get(),
                logoutUseCase = get(),
            )
        }
    }
)