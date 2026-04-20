package org.trichter.app.features.ble.domain.usecases

import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import org.trichter.api.client.apis.UsersApi
import org.trichter.app.features.auth.domain.AuthRepository
import org.trichter.app.features.auth.domain.model.AuthState
import org.trichter.app.features.ble.domain.models.UserDto

class GetCurrentUser(
    private val authRepository: AuthRepository,
    private val usersApi: UsersApi,
) {
    suspend operator fun invoke(): Result<UserDto> = runCatching {
        val authState = authRepository.authState.value
        val token = (authState as? AuthState.Authenticated)?.session?.accessToken
            ?: error("Not authenticated")

        val userId = parseJwtSubject(token) ?: error("Cannot read user ID from token")

        val apiUser = usersApi.getUserById(userId).body()
        UserDto(
            id = apiUser.id ?: error("User has no ID"),
            username = apiUser.username,
            displayUsername = apiUser.displayUsername,
        )
    }

    @OptIn(ExperimentalEncodingApi::class)
    private fun parseJwtSubject(token: String): String? = try {
        val payload = token.split(".").getOrNull(1) ?: return null
        val padded = payload + "=".repeat((4 - payload.length % 4) % 4)
        val bytes = Base64.UrlSafe.decode(padded)
        val json = Json { ignoreUnknownKeys = true }
        json.parseToJsonElement(bytes.decodeToString()).jsonObject["sub"]?.jsonPrimitive?.content
    } catch (_: Exception) { null }
}
