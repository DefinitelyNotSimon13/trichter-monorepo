package org.trichter.backend.common.errors

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.Instant

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException::class)
    fun handleNotFoundException(exception: Exception, request: HttpServletRequest): ResponseEntity<Map<String, Any>> =
        ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            mapOf(
                "timestamp" to Instant.now(),
                "status" to 404,
                "error" to "Not Found",
                "message" to exception.message.orEmpty(),
                "path" to request.requestURI,

            )
        )
}