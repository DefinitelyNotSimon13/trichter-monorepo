package org.trichter.app.di

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import dev.icerock.moko.permissions.compose.BindEffect
import dev.icerock.moko.permissions.compose.rememberPermissionsControllerFactory
import org.koin.core.module.Module
import org.koin.dsl.module
import org.publicvalue.multiplatform.oidc.OpenIdConnectClient
import org.publicvalue.multiplatform.oidc.types.CodeChallengeMethod
import org.trichter.app.features.ble.di.bleModules
import org.trichter.app.features.runs.di.runsModule
import org.trichter.app.service.createPreferencesDataStore

fun regularAppModules() = listOf(serviceModule ) + bleModules() + runsModule() + authModules()

fun authModules() = listOf(
    module {
        single {
            OpenIdConnectClient(discoveryUri = "http://192.168.178.44:3000/api/auth/.well-known/openid-configuration") {
                clientId = "rWcbmJYiEYgmYSgREMfYjyOFmYQdZPQL"
                clientSecret = "KtTARSeiXkAaywENVGDPQXTAPOfetJxX"
                scope = "openid profile"
                codeChallengeMethod = CodeChallengeMethod.S256
                redirectUri = "org.trichter.app://oauth/callback"
            }
        }
    }
)

@Composable
fun getComposableAppModules() = listOf(permissionsModule())

val serviceModule = module  {
    single<DataStore<Preferences>> { createPreferencesDataStore() }
}

@Composable
fun permissionsModule(): Module {
    val permissionsFactory = rememberPermissionsControllerFactory()
    val permissionsController = remember {
        permissionsFactory.createPermissionsController()
    }

    BindEffect(permissionsController)

    val permissionsModule = remember(permissionsController) {
        module {
            single { permissionsController }
        }
    }
    return permissionsModule
}
