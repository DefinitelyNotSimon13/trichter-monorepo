package org.trichter.app.service

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import org.trichter.app.MainActivity
import org.trichter.app.features.ble.domain.BleRepository
import org.trichter.app.features.ble.domain.models.Connection
import org.trichter.app.features.ble.domain.models.SessionStatus
import org.trichter.app.features.ble.domain.models.TrichterState

class BleConnectionService : Service(), KoinComponent {

    private val repo: BleRepository by inject()
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification(TrichterState()))
        scope.launch {
            repo.trichterState.collect { state ->
                NotificationManagerCompat.from(this@BleConnectionService)
                    .notify(NOTIFICATION_ID, buildNotification(state))
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int = START_STICKY

    override fun onDestroy() {
        scope.cancel()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "BLE Connection",
            NotificationManager.IMPORTANCE_LOW,
        ).apply {
            description = "Shows Trichter device connection status"
            setShowBadge(false)
        }
        getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
    }

    private fun buildNotification(state: TrichterState): android.app.Notification {
        val contentText = when (state.connection) {
            Connection.Connected -> when (state.status) {
                SessionStatus.WAITING  -> "Waiting for flow\u2026"
                SessionStatus.RUNNING  -> "Measuring\u2026"
                SessionStatus.COMPLETE -> "Run complete \u2014 open app to save"
                SessionStatus.ERROR    -> "Device error"
                else                   -> "Connected \u00b7 Ready"
            }
            Connection.Connecting  -> "Connecting\u2026"
            Connection.Disconnected -> "Disconnected"
        }

        val tapIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_SINGLE_TOP
            },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Trichter")
            .setContentText(contentText)
            .setSmallIcon(android.R.drawable.stat_sys_data_bluetooth)
            .setContentIntent(tapIntent)
            .setOngoing(true)
            .setSilent(true)
            .build()
    }

    companion object {
        private const val CHANNEL_ID = "trichter_ble"
        private const val NOTIFICATION_ID = 1001
    }
}
