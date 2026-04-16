package org.trichter.app.features.ble.data.network

import org.trichter.app.features.ble.domain.models.NewRunDto
import org.trichter.app.features.ble.domain.models.UserDto

interface ApiService {
    suspend fun uploadImage(imageBytes: ByteArray): Result<String>
    suspend fun createRun(newRun: NewRunDto): Result<Unit>
    suspend fun searchUsers(name: String): Result<List<UserDto>>
}