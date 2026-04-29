package org.trichter.app.features.ble.domain.usecases

import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import org.publicvalue.multiplatform.oidc.types.Jwt
import org.trichter.api.client.apis.UsersApi
import org.trichter.app.features.auth.domain.AuthRepository
import org.trichter.app.features.auth.domain.model.AuthState
import org.trichter.app.features.auth.presentation.LoginScreen
import org.trichter.app.features.ble.domain.models.UserDto
import org.trichter.app.util.Log

class GetCurrentUser(
    private val authRepository: AuthRepository,
    private val usersApi: UsersApi,
) {
    suspend operator fun invoke(): Result<UserDto> = runCatching {
        val authState = authRepository.authState.value
        val token = (authState as? AuthState.Authenticated)?.session?.idToken
            ?: error("Not authenticated")

        val jwt = Jwt.parse(token);

        val userId = jwt.payload.sub ?: error("Token doesn't contain UserID")

        val apiUser = usersApi.getUserById(userId).body()
        UserDto(
            id = apiUser.id ?: error("User has no ID"),
            username = apiUser.username,
            displayUsername = apiUser.displayUsername,
        )
    }
}
