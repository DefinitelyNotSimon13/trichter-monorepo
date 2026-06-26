package org.trichter.app.features.ble.domain.usecases

import org.trichter.app.features.ble.domain.PermissionsGateway

class RequestCameraPermissions(
    private val gateway: PermissionsGateway,
) {
    suspend operator fun invoke() = gateway.requestCameraPermissions()
}
