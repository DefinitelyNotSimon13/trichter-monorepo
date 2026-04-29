package org.trichter.app.features.auth.data

import org.publicvalue.multiplatform.oidc.ExperimentalOpenIdConnect
import org.publicvalue.multiplatform.oidc.tokenstore.TokenStore
import org.trichter.app.features.auth.domain.model.AuthSession

@OptIn(ExperimentalOpenIdConnect::class)
class AuthPreferencesTokenStore(
    private val authPreferences: AuthPreferences
) : TokenStore() {
    override val accessTokenFlow = authPreferences.observeAccessToken()
    override val refreshTokenFlow = authPreferences.observeRefreshToken()
    override val idTokenFlow = authPreferences.observeIdToken()

    override suspend fun getAccessToken() = authPreferences.getSession()?.accessToken
    override suspend fun getRefreshToken() = authPreferences.getSession()?.refreshToken
    override suspend fun getIdToken() = authPreferences.getSession()?.idToken

    override suspend fun saveTokens(accessToken: String, refreshToken: String?, idToken: String?) {
        authPreferences.saveSession(
            AuthSession(accessToken = accessToken, refreshToken = refreshToken, idToken = idToken)
        )
    }

    override suspend fun removeAccessToken() = authPreferences.removeAccessToken()
    override suspend fun removeRefreshToken() = authPreferences.removeRefreshToken()
    override suspend fun removeIdToken() = authPreferences.removeIdToken()
}
