package org.trichter.backend.users.web

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springdoc.core.annotations.ParameterObject
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.trichter.backend.users.model.UserDto
import org.trichter.backend.users.usecase.GetAllUsersUseCase
import org.trichter.backend.users.usecase.GetUserByIdUseCase
import org.trichter.backend.users.usecase.SearchUserUseCase

@RestController
@RequestMapping("/api/v2/users")
@Tag(name = "Users", description = "Read-only user management")
@PreAuthorize("isAuthenticated()")
class UserController(
    private val searchUserUseCase: SearchUserUseCase,
    private val getAllUsersUseCase: GetAllUsersUseCase,
    private val getUserByIdUseCase: GetUserByIdUseCase,
) {

    @GetMapping
    @Operation(
        summary = "Get or search users",
        description = "Returns a paginated list of users. If 'q' is provided, filters by username or display name."
    )
    fun getUsers(
        @RequestParam(required = false)
        @Parameter(description = "Search query")
        q: String?,
        @ParameterObject pageable: Pageable,
    ): Page<UserDto> {
        return if (q.isNullOrBlank()) {
            getAllUsersUseCase(pageable)
        } else {
            searchUserUseCase(q.trim(), pageable)
        }
    }

    @GetMapping("/{userId}")
    @Operation(
        summary = "Get user by ID",
        description = "Returns a single user by ID.",
        responses = [
            ApiResponse(
                responseCode = "200",
                description = "User found",
                content = [Content(schema = Schema(implementation = UserDto::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "User not found"
            )
        ]
    )
    fun getUserById(
        @PathVariable userId: String,
    ): UserDto {
        return getUserByIdUseCase(userId)
    }
}
