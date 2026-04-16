package org.trichter.app.features.auth.data

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.publicvalue.multiplatform.oidc.OpenIdConnectClient
import org.publicvalue.multiplatform.oidc.appsupport.CodeAuthFlowFactory
import org.publicvalue.multiplatform.oidc.flows.CodeAuthFlow
import org.trichter.app.features.auth.domain.AuthRepository
import org.trichter.app.features.auth.domain.model.AuthSession
import org.trichter.app.features.auth.domain.model.AuthState
import org.trichter.app.util.Log

class OidcAuthRepository(
    private val oidcClient: OpenIdConnectClient,
    private val codeAuthFlowFactory: CodeAuthFlowFactory,
    private val authPreferences: AuthPreferences,
) : AuthRepository {

    private val mutableAuthState = MutableStateFlow<AuthState>(AuthState.Initializing)
    override val authState: StateFlow<AuthState> = mutableAuthState.asStateFlow()

    override suspend fun initialize() {
        mutableAuthState.value = AuthState.Initializing

        try {
            Log.i("AUTH", "Discovering OIDC provider")
            oidcClient.discover()

            val flow = codeAuthFlowFactory.createAuthFlow(oidcClient)

            if (flow.canContinueLogin()) {
                Log.i("AUTH", "Continuing pending login flow")
                mutableAuthState.value = AuthState.Authenticating

                val session = continueLogin(flow)
                authPreferences.saveSession(session)
                mutableAuthState.value = AuthState.Authenticated(session)
                return
            }

            val savedSession = authPreferences.getSession()
            if (savedSession != null) {
                Log.i("AUTH", "Restored saved session")
                mutableAuthState.value = AuthState.Authenticated(savedSession)
            } else {
                Log.i("AUTH", "No saved session found")
                mutableAuthState.value = AuthState.Unauthenticated
            }
        } catch (t: Throwable) {
            Log.e("AUTH", "Initialization failed", t)
            mutableAuthState.value =
                AuthState.Error(t.message ?: "Unable to initialize authentication")
        }
    }

    override suspend fun login() {
        try {
            Log.i("AUTH", "Starting interactive login")
            mutableAuthState.value = AuthState.Authenticating

            val flow = codeAuthFlowFactory.createAuthFlow(oidcClient)

            /*
             * Opens the browser / custom tab when needed.
             * After the redirect returns into the app, initialize() or a new call
             * to login() can resume via canContinueLogin()/continueLogin().
             */
            if (!flow.canContinueLogin()) {
                flow.startLogin()
                return
            }

            val session = continueLogin(flow)
            authPreferences.saveSession(session)
            mutableAuthState.value = AuthState.Authenticated(session)
        } catch (t: Throwable) {
            Log.e("AUTH", "Login failed", t)
            authPreferences.clearSession()
            mutableAuthState.value =
                AuthState.Error(t.message ?: "Login failed")
        }
    }

    override suspend fun logout() {
        authPreferences.clearSession()
        mutableAuthState.value = AuthState.Unauthenticated
    }

    private suspend fun continueLogin(authFlow: CodeAuthFlow): AuthSession {
        val tokens = authFlow.continueLogin()

        //TODO: Also work with expires_at stuff?

        return AuthSession(
            accessToken = tokens.access_token,
            refreshToken = tokens.refresh_token,
            idToken = tokens.id_token,
            expiresIn = tokens.expires_in
        )
    }
}
