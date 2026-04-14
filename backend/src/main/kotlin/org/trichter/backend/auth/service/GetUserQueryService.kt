package org.trichter.backend.auth.service

import org.springframework.stereotype.Service
import org.trichter.backend.auth.model.UserInfo
import org.trichter.backend.auth.repository.UserReadRepository
import org.trichter.backend.common.errors.NotFoundException

@Service
class GetUserQueryService(
    private val userReadRepository: UserReadRepository
) {
    fun getUserInfo(userId: String): UserInfo {
        val user = userReadRepository.findById(userId)
            .orElseThrow { NotFoundException("User $userId not found") }

        return user.toUserInfo()
    }
}