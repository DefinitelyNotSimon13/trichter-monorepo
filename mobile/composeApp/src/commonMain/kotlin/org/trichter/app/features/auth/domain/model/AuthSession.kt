package org.trichter.app.features.auth.domain.model

data class AuthSession(
    val accessToken: String,
    val refreshToken: String? = null,
    val idToken: String? = null,
    val expiresIn: Int? = null
)