package org.trichter.app.features.ble.domain.usecases

import org.trichter.api.client.apis.UsersApi
import org.trichter.app.features.ble.domain.models.UserDto

class SearchUsers(private val usersApi: UsersApi) {
    suspend operator fun invoke(query: String): Result<List<UserDto>> {
        if (query.isBlank()) return Result.success(emptyList())
        return runCatching {
            usersApi.getUsers(q = query.trim()).body()
                .content.orEmpty()
                .mapNotNull { apiUser ->
                    val id = apiUser.id ?: return@mapNotNull null
                    UserDto(
                        id = id,
                        username = apiUser.username,
                        displayUsername = apiUser.displayUsername,
                    )
                }
        }
    }
}
