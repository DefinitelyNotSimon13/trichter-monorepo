package org.trichter.app.features.auth.data

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import org.trichter.app.features.auth.domain.model.AuthSession

private object AuthPreferenceKeys {
    val accessToken = stringPreferencesKey("auth.access_token")
    val refreshToken = stringPreferencesKey("auth.refresh_token")
    val idToken = stringPreferencesKey("auth.id_token")
}

class AuthPreferences(
    private val dataStore: DataStore<Preferences>
) {
    suspend fun getSession(): AuthSession? {
        val preferences = dataStore.data.first()

        val accessToken = preferences[AuthPreferenceKeys.accessToken] ?: return null
        val refreshToken = preferences[AuthPreferenceKeys.refreshToken]
        val idToken = preferences[AuthPreferenceKeys.idToken]

        return AuthSession(
            accessToken = accessToken,
            refreshToken = refreshToken,
            idToken = idToken
        )
    }
    suspend fun saveSession(session: AuthSession) {
        dataStore.edit { preferences ->
            preferences[AuthPreferenceKeys.accessToken] = session.accessToken

            if (session.refreshToken != null) {
                preferences[AuthPreferenceKeys.refreshToken] = session.refreshToken
            } else {
                preferences.remove(AuthPreferenceKeys.refreshToken)
            }

            if (session.idToken != null) {
                preferences[AuthPreferenceKeys.idToken] = session.idToken
            } else {
                preferences.remove(AuthPreferenceKeys.idToken)
            }
        }
    }

    suspend fun clearSession() {
        dataStore.edit { preferences ->
            preferences.remove(AuthPreferenceKeys.accessToken)
            preferences.remove(AuthPreferenceKeys.refreshToken)
            preferences.remove(AuthPreferenceKeys.idToken)
        }
    }

    fun observeAccessToken() = dataStore.data.map { preferences ->
        preferences[AuthPreferenceKeys.accessToken]
    }
}
