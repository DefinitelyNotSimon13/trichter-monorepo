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
import org.koin.core.context.GlobalContext
import org.trichter.app.MainActivity
import org.trichter.app.features.ble.domain.BleRepository
import org.trichter.app.features.ble.domain.models.Connection
import org.trichter.app.features.ble.domain.models.SessionStatus
import org.trichter.app.features.ble.domain.models.TrichterState
import android.util.Log

class BleConnectionService : Service() {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    @androidx.annotation.RequiresPermission(android.Manifest.permission.POST_NOTIFICATIONS)
    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification(TrichterState()))

        // Try to get BleRepository from Koin, handling the case where it might not be initialized
        try {
            val koin = GlobalContext.getOrNull()
            if (koin != null) {
                val repo = koin.get<BleRepository>()
                scope.launch {
                    repo.trichterState.collect  { state ->
                        NotificationManagerCompat.from(this@BleConnectionService)
                            .notify(NOTIFICATION_ID, buildNotification(state))
                    }
                }
            } else {
                Log.d("BleConnectionService", "Koin context not available")
            }
        } catch (e: Exception) {
            Log.w("BleConnectionService", "Failed to get BleRepository from Koin", e)
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
            "Device connection",
            NotificationManager.IMPORTANCE_HIGH,
        ).apply {
            description = "Shows the active Trichter device connection"
            setShowBadge(false)
            enableVibration(false)
            setSound(null, null)
            lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
        }

        getSystemService(NotificationManager::class.java)
            .createNotificationChannel(channel)
    }

    private fun buildNotification(state: TrichterState): android.app.Notification {
        val contentText = when (state.connection) {
            Connection.Connected -> when (state.status) {
                SessionStatus.WAITING -> "Connected · Waiting for flow..."
                SessionStatus.RUNNING -> "Connected · Measuring..."
                SessionStatus.COMPLETE -> "Run complete · Open app to save"
                SessionStatus.ERROR -> "Connected · Device error"
                else -> "Connected · Ready"
            }

            Connection.Connecting -> "Connecting"
            Connection.Disconnected -> "Disconnected"
        }

        val tapIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
            },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Trichter active")
            .setContentText(contentText)
            .setSmallIcon(android.R.drawable.stat_sys_data_bluetooth)
            .setContentIntent(tapIntent)

            // Important bits
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setOngoing(true)
            .setAutoCancel(false)
            .setOnlyAlertOnce(true)
            .setSilent(true)
            .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)

            // Nice-to-have
            .setShowWhen(false)
            .setLocalOnly(true)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .build()
    }

    companion object {
        private const val CHANNEL_ID = "trichter_ble"
        private const val NOTIFICATION_ID = 1001
    }
}
