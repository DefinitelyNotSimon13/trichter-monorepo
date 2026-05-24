package org.trichter.app.features.ble.domain.usecases

import io.ktor.client.request.forms.FormPart
import io.ktor.client.request.forms.InputProvider
import io.ktor.http.ContentType
import io.ktor.http.Headers
import io.ktor.http.HttpHeaders
import io.ktor.utils.io.core.ByteReadPacket
import org.trichter.api.client.apis.RunsApi
import org.trichter.api.client.models.CreateRunRequest
import org.trichter.app.features.ble.domain.models.ResultMeta
import org.trichter.app.features.ble.domain.models.toNewRun
import org.trichter.app.util.Log

class SaveRun(
    private val runsApi: RunsApi
) {
    suspend operator fun invoke(
        resultMeta: ResultMeta,
        imageBytes: ByteArray? = null,
        userId: String? = null,
    ): Result<Unit> {

        val runResponse = runsApi.createRun(CreateRunRequest(
            userId = userId,
            duration = resultMeta.durationMs.toDouble() / 1000,
            rate = resultMeta.rateLpm.toDouble(),
            volume = resultMeta.volumeL.toDouble()
        ), "dev-secret");


        if(!runResponse.success) {
            return Result.failure(RuntimeException("Failed to save image"))
        }


        imageBytes?.let {

            val imageResponse = runsApi.uploadRunImage(runResponse.body().id ?: error("Run wasn't created properly (no id)"),
                imageFormPart(it))

            if(!imageResponse.success) {
                Log.e("SAVE", "Failed to upload image (${imageResponse.status})")
                return Result.failure(RuntimeException("Failed to save image"))
            }
        }

        return Result.success(Unit)
    }
}

fun imageFormPart(
    bytes: ByteArray,
    fileName: String = "image.jpg",
    contentType: ContentType = ContentType.Image.JPEG,
): FormPart<InputProvider> =
    FormPart(
        key = "file",
        value = InputProvider { ByteReadPacket(bytes) },
        headers = Headers.build {
            append(HttpHeaders.ContentType, contentType.toString())
            append(HttpHeaders.ContentDisposition, "filename=\"image.jpg\"")
        }
    )