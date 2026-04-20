package org.trichter.app

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import org.publicvalue.multiplatform.oidc.appsupport.AndroidCodeAuthFlowFactory
import org.trichter.app.service.initPreferencesDataStore

class MainActivity : ComponentActivity() {
    private val codeAuthFlowFactory: AndroidCodeAuthFlowFactory =
        AndroidCodeAuthFlowFactory(useWebView = false)
    private val _deepLinkUri = MutableStateFlow<String?>(null)
    val deepLinkUri = _deepLinkUri.asStateFlow()

    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        codeAuthFlowFactory.registerActivity(this)
        initPreferencesDataStore(applicationContext)

        handleIntent(intent)

        setContent {
            App(
                codeAuthFlowFactory = codeAuthFlowFactory,
                deepLinkUriFlow = deepLinkUri
            )
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleIntent(intent)
    }

    private fun handleIntent(intent: Intent?) {
        if (intent?.action == Intent.ACTION_VIEW) {
            _deepLinkUri.value = intent.data.toString()

        }
    }
}

@Preview
@Composable
fun AppAndroidPreview() {
    App(AndroidCodeAuthFlowFactory(), MutableStateFlow<String?>(null))
}
