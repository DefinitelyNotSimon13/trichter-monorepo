package org.trichter.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import org.publicvalue.multiplatform.oidc.appsupport.AndroidCodeAuthFlowFactory
import org.trichter.app.service.initPreferencesDataStore

class MainActivity : ComponentActivity() {
    private val codeAuthFlowFactory: AndroidCodeAuthFlowFactory =
        AndroidCodeAuthFlowFactory(useWebView = false)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        codeAuthFlowFactory.registerActivity(this)
        initPreferencesDataStore(applicationContext)

        setContent {
            App(
                codeAuthFlowFactory = codeAuthFlowFactory,
            )
        }
    }
}

@Preview
@Composable
fun AppAndroidPreview() {
    App(AndroidCodeAuthFlowFactory())
}
