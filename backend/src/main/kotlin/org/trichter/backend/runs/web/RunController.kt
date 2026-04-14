package org.trichter.backend.runs.web

import com.azure.core.http.HttpHeader
import jakarta.validation.Valid
import org.springdoc.core.converters.models.PageableAsQueryParam
import org.springframework.core.io.ByteArrayResource
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.http.ContentDisposition
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import org.trichter.backend.runs.model.RunView
import org.trichter.backend.runs.repository.RunRepository
import org.trichter.backend.runs.storage.SignedImageUrl
import org.trichter.backend.runs.usecase.CreateRunUseCase
import org.trichter.backend.runs.usecase.GetRunImageSignedUrlUseCase
import org.trichter.backend.runs.usecase.GetRunImageUseCase
import org.trichter.backend.runs.usecase.GetRunUseCase
import org.trichter.backend.runs.usecase.GetRunsByUserUseCase
import org.trichter.backend.runs.usecase.GetRunsUseCase
import org.trichter.backend.runs.usecase.UploadRunImageUseCase
import org.trichter.backend.runs.web.dto.CreateRunRequest
import java.util.UUID

@RestController
@RequestMapping("/api/v2")
class RunController(
    private val createRunUseCase: CreateRunUseCase,
    private val getRunUseCase: GetRunUseCase,
    private val getRunsUseCase: GetRunsUseCase,
    private val getRunsByUserUseCase: GetRunsByUserUseCase,
    private val uploadRunImageUseCase: UploadRunImageUseCase,
    private val getRunImageUseCase: GetRunImageUseCase,
    private val getRunImageSignedUrlUseCase: GetRunImageSignedUrlUseCase
) {
    @GetMapping("/runs")
    fun getRuns(
        @PageableDefault(sort = ["createdAt"], direction = Sort.Direction.DESC) pageable: Pageable
    ): Page<RunView> = getRunsUseCase(pageable)

    @GetMapping("/runs/{id}")
    fun getRun(@PathVariable id: UUID): RunView = getRunUseCase(id)


    @PostMapping("/runs")
    @ResponseStatus(HttpStatus.CREATED)
    fun createRun(
        @Valid @RequestBody request: CreateRunRequest
    ): RunView = createRunUseCase(
        userId = request.userId,
        rate = request.rate,
        volume = request.volume,
        duration = request.duration,
    )

    @GetMapping("/users/{userId}/runs")
    fun getRunsByUser(
        @PathVariable userId: String,
        @PageableDefault(sort = ["createdAt"], direction = Sort.Direction.DESC) pageable: Pageable
    ): Page<RunView> = getRunsByUserUseCase(userId, pageable)

    @PutMapping("/runs/{id}/image", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun uploadRunImage(
        @PathVariable id: UUID,
        @RequestPart("file") file: MultipartFile,
    ): RunView = uploadRunImageUseCase(
        runId = id,
        bytes = file.bytes,
        contentType = file.contentType ?: MediaType.APPLICATION_OCTET_STREAM_VALUE
    )


    @GetMapping("/runs/{id}/image")
    fun getRunImage(
        @PathVariable id: UUID,
    ): ResponseEntity<ByteArrayResource> {
        val image = getRunImageUseCase(id)

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(image.contentType))
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                ContentDisposition.inline().filename("run-image").build().toString()
            )
            .body(ByteArrayResource(image.bytes))
    }

    @GetMapping("/runs/{id}/image/signed-url")
    fun getRunImageSignedUrl(
        @PathVariable id: UUID,
    ): SignedImageUrl = getRunImageSignedUrlUseCase(id)
}