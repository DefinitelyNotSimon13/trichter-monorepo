package org.trichter.backend.common.errors

import jakarta.servlet.http.HttpServletRequest
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.security.access.AccessDeniedException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.server.ResponseStatusException
import java.time.Instant

@RestControllerAdvice
class GlobalExceptionHandler {

    private val log = LoggerFactory.getLogger(javaClass)

    @ExceptionHandler(NotFoundException::class)
    fun handleNotFound(ex: NotFoundException, request: HttpServletRequest) =
        errorResponse(HttpStatus.NOT_FOUND, ex.message.orEmpty(), request)

    @ExceptionHandler(ConflictException::class)
    fun handleConflict(ex: ConflictException, request: HttpServletRequest) =
        errorResponse(HttpStatus.CONFLICT, ex.message.orEmpty(), request)

    @ExceptionHandler(AccessDeniedException::class)
    fun handleAccessDenied(ex: AccessDeniedException, request: HttpServletRequest) =
        errorResponse(HttpStatus.FORBIDDEN, "Access denied", request)

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException, request: HttpServletRequest): ResponseEntity<ErrorResponse> {
        val fieldErrors = ex.bindingResult.fieldErrors
            .joinToString("; ") { "${it.field}: ${it.defaultMessage}" }
        return errorResponse(HttpStatus.BAD_REQUEST, fieldErrors.ifBlank { "Validation failed" }, request)
    }

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleUnreadable(ex: HttpMessageNotReadableException, request: HttpServletRequest) =
        errorResponse(HttpStatus.BAD_REQUEST, "Malformed request body", request)

    @ExceptionHandler(ResponseStatusException::class)
    fun handleResponseStatus(ex: ResponseStatusException, request: HttpServletRequest) =
        errorResponse(HttpStatus.valueOf(ex.statusCode.value()), ex.reason ?: ex.message, request)

    @ExceptionHandler(Exception::class)
    fun handleUnexpected(ex: Exception, request: HttpServletRequest): ResponseEntity<ErrorResponse> {
        log.error("Unhandled exception on {}", request.requestURI, ex)
        return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", request)
    }

    private fun errorResponse(status: HttpStatus, message: String, request: HttpServletRequest) =
        ResponseEntity.status(status).body(
            ErrorResponse(
                timestamp = Instant.now(),
                status = status.value(),
                error = status.reasonPhrase,
                message = message,
                path = request.requestURI,
            )
        )
}
