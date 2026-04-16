package org.trichter.backend.runs.web

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
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
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
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.ExampleObject
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.parameters.RequestBody as SwaggerRequestBody
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springdoc.core.annotations.ParameterObject
import org.trichter.backend.runs.model.RunDto

@RestController
@RequestMapping("/api/v2")
@Tag(name = "Runs", description = "Operations related to run tracking")
class RunController(
    private val createRunUseCase: CreateRunUseCase,
    private val getRunUseCase: GetRunUseCase,
    private val getRunsUseCase: GetRunsUseCase,
    private val getRunsByUserUseCase: GetRunsByUserUseCase,
    private val uploadRunImageUseCase: UploadRunImageUseCase,
    private val getRunImageUseCase: GetRunImageUseCase,
    private val getRunImageSignedUrlUseCase: GetRunImageSignedUrlUseCase
) {

    @Operation(
        summary = "List runs",
        description = "Returns paginated runs sorted by creation date (newest first)"
    )
    @PageableAsQueryParam
    @GetMapping("/runs")
    fun getRuns(
        @ParameterObject
        @PageableDefault(sort = ["createdAt"], direction = Sort.Direction.DESC)
        pageable: Pageable
    ): Page<RunDto> = getRunsUseCase(pageable)

    @Operation(summary = "Get run by ID")
    @ApiResponse(responseCode = "200", description = "Run found")
    @ApiResponse(responseCode = "404", description = "Run not found")
    @GetMapping("/runs/{id}")
    fun getRun(
        @Parameter(description = "Run ID", example = "0787de56-ca0d-4109-b579-70122a73867b")
        @PathVariable id: UUID
    ): RunDto = getRunUseCase(id)

    @Operation(
        summary = "Create a new run",
        description = "Creates a run entry without an image"
    )
    @ApiResponse(responseCode = "201", description = "Run created")
    @PostMapping("/runs")
    @ResponseStatus(HttpStatus.CREATED)
    fun createRun(
        @SwaggerRequestBody(
            required = true,
            description = "Run creation payload",
            content = [
                Content(
                    schema = Schema(implementation = CreateRunRequest::class),
                    examples = [
                        ExampleObject(
                            value = """
                            {
                              "userId": "user-123",
                              "rate": 5.5,
                              "volume": 1.4,
                              "duration": 1000
                            }
                            """
                        )
                    ]
                )
            ]
        )
        @Valid @RequestBody request: CreateRunRequest
    ): RunDto = createRunUseCase(
        userId = request.userId,
        rate = request.rate,
        volume = request.volume,
        duration = request.duration,
    )

    @Operation(summary = "List runs by user")
    @PageableAsQueryParam
    @GetMapping("/users/{userId}/runs")
    fun getRunsByUser(
        @Parameter(description = "User ID", example = "user-123")
        @PathVariable userId: String,
        @ParameterObject
        @PageableDefault(sort = ["createdAt"], direction = Sort.Direction.DESC)
        pageable: Pageable
    ): Page<RunDto> = getRunsByUserUseCase(userId, pageable)

    @Operation(
        summary = "Upload run image",
        description = "Uploads or replaces an image for a run"
    )
    @ApiResponse(responseCode = "200", description = "Image uploaded")
    @PutMapping("/runs/{id}/image", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun uploadRunImage(
        @Parameter(description = "Run ID")
        @PathVariable id: UUID,

        @Parameter(
            description = "Image file (JPEG recommended)",
            required = true,
            content = [Content(
                mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                schema = Schema(type = "string", format = "binary")
            )]
        )
        @RequestPart("file") file: MultipartFile,
    ): RunDto = uploadRunImageUseCase(
        runId = id,
        bytes = file.bytes,
        contentType = file.contentType ?: MediaType.APPLICATION_OCTET_STREAM_VALUE
    )

    @Operation(
        summary = "Download run image",
        description = "Returns the raw image bytes"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Image returned",
        content = [Content(
            mediaType = "image/*",
            schema = Schema(type = "string", format = "binary")
        )]
    )
    @GetMapping("/runs/{id}/image")
    fun getRunImage(
        @Parameter(description = "Run ID")
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

    @Operation(
        summary = "Get signed image URL",
        description = "Returns a temporary signed URL for accessing the run image"
    )
    @ApiResponse(responseCode = "200", description = "Signed URL returned")
    @GetMapping("/runs/{id}/image/signed-url")
    fun getRunImageSignedUrl(
        @Parameter(description = "Run ID")
        @PathVariable id: UUID,
    ): SignedImageUrl = getRunImageSignedUrlUseCase(id)
}
