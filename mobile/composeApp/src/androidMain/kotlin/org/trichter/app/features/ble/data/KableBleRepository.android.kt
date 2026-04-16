package org.trichter.app.features.ble.data

import com.juul.kable.AndroidPeripheral
import com.juul.kable.Peripheral

actual suspend fun Peripheral.requestMtu(mtu: Int) {
    if(this is AndroidPeripheral) {
        this.requestMtu(mtu)
    }
}