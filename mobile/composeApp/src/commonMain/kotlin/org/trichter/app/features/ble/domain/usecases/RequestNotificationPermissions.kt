package org.trichter.app.features.ble.domain.usecases

import org.trichter.app.features.ble.domain.PermissionsGateway

class RequestNotificationPermissions(
    private val gateway: PermissionsGateway
) {
    suspend operator fun invoke() = gateway.requestNotificationPermissions()
}