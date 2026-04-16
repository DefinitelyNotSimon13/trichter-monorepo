package org.trichter.app

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import coil3.ImageLoader
import coil3.compose.setSingletonImageLoaderFactory
import coil3.request.crossfade
import org.koin.compose.KoinMultiplatformApplication
import org.koin.compose.koinInject
import org.koin.compose.viewmodel.koinViewModel
import org.koin.core.annotation.KoinExperimentalAPI
import org.koin.dsl.KoinConfiguration
import org.koin.dsl.module
import org.publicvalue.multiplatform.oidc.OpenIdConnectClient
import org.publicvalue.multiplatform.oidc.appsupport.CodeAuthFlowFactory
import org.trichter.app.di.getComposableAppModules
import org.trichter.app.di.regularAppModules
import org.trichter.app.features.ble.presentation.BleScreen
import org.trichter.app.features.ble.presentation.BleViewModel
import org.trichter.app.features.runs.presentation.RunsScreen
import org.trichter.app.features.runs.presentation.RunsViewModel
import org.trichter.app.navigation.Routes
import org.trichter.app.ui.theme.TrichterTheme
import org.trichter.app.util.Log

@OptIn(KoinExperimentalAPI::class)
@Composable
@Preview
fun App(
    codeAuthFlowFactory: CodeAuthFlowFactory
) {
    setSingletonImageLoaderFactory { context ->
        ImageLoader.Builder(context).crossfade(true).build()
    }

    val composableAppModules = getComposableAppModules()
    KoinMultiplatformApplication(config = KoinConfiguration { modules(regularAppModules() + composableAppModules + module { factory { codeAuthFlowFactory } }) }) {
        TrichterTheme {
            AppScreen()
        }
    }
}


@Composable
fun AppScreen(
    navController: NavHostController = rememberNavController()
) {

    val authFlowFactory: CodeAuthFlowFactory = koinInject()
    val oidcClient: OpenIdConnectClient = koinInject()

    LaunchedEffect(Unit) {
        try {
            oidcClient.discover()
            val flow = authFlowFactory.createAuthFlow(oidcClient)
            val token = flow.getAccessToken()

            Log.i("TEST", "Token: $token")
        } catch (e: Exception) {
            Log.e("AUTHENTICATION", "Unable to receive token")

        }
    }


    Scaffold(
        bottomBar = { BottomNavigationBar(navController = navController) }

    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Routes.RUNS.route,
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            composable(route = Routes.RUNS.route) {
                val viewModel: RunsViewModel = koinViewModel()
                RunsScreen(viewModel = viewModel)
            }
            composable(route = Routes.BLE.route) {
                val viewModel: BleViewModel = koinViewModel()
                BleScreen(viewModel = viewModel)

            }
        }
    }
}

@Composable
fun BottomNavigationBar(navController: NavHostController) {
    val currentBackStackEntry by navController.currentBackStackEntryAsState()
    val currenRoute = currentBackStackEntry?.destination?.route

    val routes = listOf(Routes.RUNS, Routes.BLE)
    NavigationBar {
        routes.forEach { item ->
            val isSelected = currenRoute == item.route
            NavigationBarItem(
                icon = {
                    Icon(imageVector = item.icon, contentDescription = item.title)
                },
                label = {
                    Text(text = item.title)
                },
                selected = isSelected,
                onClick = {
                    navController.navigate(item.route) {
                        popUpTo(navController.graph.startDestinationId)
                        launchSingleTop = true
                    }
                },
            )
        }
    }
}
