package org.trichter.app

import androidx.compose.ui.window.ComposeUIViewController
import org.publicvalue.multiplatform.oidc.appsupport.IosCodeAuthFlowFactory

fun MainViewController() = ComposeUIViewController (
    configure = {
    }
){
    App(
        IosCodeAuthFlowFactory()
    )
}