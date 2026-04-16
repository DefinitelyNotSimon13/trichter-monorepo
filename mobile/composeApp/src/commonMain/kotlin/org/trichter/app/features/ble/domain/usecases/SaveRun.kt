package org.trichter.app.features.ble.domain.usecases

import org.trichter.app.features.ble.data.network.ApiService
import org.trichter.app.features.ble.domain.models.ResultMeta
import org.trichter.app.features.ble.domain.models.toNewRun
import org.trichter.app.util.Log

class SaveRun(
    private val apiService: ApiService
) {
    suspend operator fun invoke(
        resultMeta: ResultMeta,
        imageBytes: ByteArray? = null,
        userId: String? = null,
    ): Result<Unit> {
        val image = imageBytes?.let { bytes ->
            apiService.uploadImage(bytes).fold(
                onSuccess = { resource ->
                    Log.i("SAVE", "Image uploaded successfully: $resource")
                    resource
                },
                onFailure = { error ->
                    Log.e("SAVE", "Failed to upload image", error)
                    return Result.failure(error)
                }
            )
        }

        return apiService.createRun(
            resultMeta.toNewRun(
                image = image,
                userId = userId,
            )
        ).fold(
            onSuccess = {
                Log.i("SAVE", "Run saved successfully")
                Result.success(Unit)
            },
            onFailure = { error ->
                Log.e("SAVE", "Failed to save run", error)
                Result.failure(error)
            }
        )
    }
}
