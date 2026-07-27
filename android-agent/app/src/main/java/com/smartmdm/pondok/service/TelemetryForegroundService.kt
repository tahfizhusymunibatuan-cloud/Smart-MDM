package com.smartmdm.pondok.service

import android.app.*
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.ServiceInfo
import android.os.BatteryManager
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.smartmdm.pondok.R
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

class TelemetryForegroundService : Service() {

    private val CHANNEL_ID = "SmartMdmServiceChannel"
    private var isRunning = false

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Smart MDM Pondok")
            .setContentText("Monitoring Kepatuhan HP Santri Aktif")
            .setSmallIcon(android.R.drawable.stat_sys_warning)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(1001, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC)
        } else {
            startForeground(1001, notification)
        }

        if (!isRunning) {
            isRunning = true
            startTelemetryLoop()
        }

        return START_STICKY
    }

    private fun startTelemetryLoop() {
        thread {
            while (isRunning) {
                try {
                    sendTelemetryData()
                    Thread.sleep(30000) // Send heartbeat every 30 seconds
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }

    private fun sendTelemetryData() {
        val batteryLevel = getBatteryLevel()
        val serialNumber = "DEV-${Build.MANUFACTURER.uppercase()}-${Build.MODEL.uppercase().replace(" ", "-")}"
        val osVersion = "Android ${Build.VERSION.RELEASE}"

        val prefs = getSharedPreferences("SmartMdmPrefs", Context.MODE_PRIVATE)
        val savedServerUrl = prefs.getString("server_url", "http://192.168.1.100:4000") ?: "http://192.168.1.100:4000"
        val santriName = prefs.getString("santri_name", "") ?: ""
        val groupName = prefs.getString("group_name", "") ?: ""

        val deviceModelName = "${Build.MANUFACTURER.replaceFirstChar { it.uppercase() }} ${Build.MODEL}"
        val displayDeviceName = if (santriName.isNotEmpty()) "$deviceModelName ($santriName)" else "$deviceModelName (Santri)"

        val json = JSONObject().apply {
            put("serialNumber", serialNumber)
            put("deviceName", displayDeviceName)
            put("userName", santriName)
            put("groupName", groupName)
            put("osType", "ANDROID")
            put("osVersion", osVersion)
            put("batteryLevel", batteryLevel)
            put("internetType", "WIFI")
            put("mdmStatus", "UNMANAGED")
            put("isOnline", true)
            put("deviceHealth", if (batteryLevel > 20) "GREEN" else "YELLOW")
        }

        val targetHosts = mutableListOf<String>()
        val cleanSavedUrl = savedServerUrl.trim().removeSuffix("/")
        if (cleanSavedUrl.isNotEmpty()) {
            targetHosts.add(cleanSavedUrl)
        }
        targetHosts.addAll(listOf("http://10.0.2.2:4000", "http://192.168.1.100:4000", "http://localhost:4000", "http://127.0.0.1:4000"))

        for (baseUrl in targetHosts.distinct()) {
            try {
                val url = URL("$baseUrl/devices/auto-enroll")
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "POST"
                connection.setRequestProperty("Content-Type", "application/json")
                connection.connectTimeout = 3000
                connection.readTimeout = 3000
                connection.doOutput = true
                connection.outputStream.write(json.toString().toByteArray())
                val responseCode = connection.responseCode
                connection.disconnect()
                if (responseCode in 200..299) {
                    break // Successfully synced with backend server
                }
            } catch (e: Exception) {
                // Try next host candidate
            }
        }
    }

    private fun getBatteryLevel(): Int {
        return try {
            val batteryIntent = registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
            val level = batteryIntent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
            val scale = batteryIntent?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
            if (level >= 0 && scale > 0) (level * 100) / scale else 100
        } catch (e: Exception) {
            100
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "Smart MDM Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(serviceChannel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
