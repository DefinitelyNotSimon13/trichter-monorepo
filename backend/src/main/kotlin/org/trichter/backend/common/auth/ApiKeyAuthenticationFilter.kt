package org.trichter.backend.common.auth

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Profile
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import org.trichter.backend.users.repository.UserReadRepository
import java.time.Instant

@Component
@Profile("!dev")
class ApiKeyAuthenticationFilter(
    private val apiKeyRepository: ApiKeyRepository,
    private val userReadRepository: UserReadRepository,
) : OncePerRequestFilter() {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, chain: FilterChain) {
        val rawKey = request.getHeader("x-api-key")
        if (rawKey.isNullOrBlank()) {
            chain.doFilter(request, response)
            return
        }

        val apiKey = apiKeyRepository.findByKey(rawKey).orElse(null)
        if (apiKey == null || apiKey.enabled == false || (apiKey.expiresAt?.isBefore(Instant.now()) ?: false)) {
            log.warn("Rejected API key request: key invalid or disabled")
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid API key")
            return
        }

        val user = userReadRepository.findById(apiKey.userId).orElse(null)
        if (user == null) {
            log.warn("Rejected API key request: user not found for key")
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid API key")
            return
        }

        val authorities = listOfNotNull(
            user.role?.let { SimpleGrantedAuthority("ROLE_${it.uppercase()}") }
        )
        val authentication = UsernamePasswordAuthenticationToken(user.id, null, authorities)
        SecurityContextHolder.getContext().authentication = authentication

        log.debug("Authenticated via API key, userId={}", user.id)
        chain.doFilter(request, response)
    }
}
