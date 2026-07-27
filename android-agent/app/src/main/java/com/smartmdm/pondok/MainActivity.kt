package com.smartmdm.pondok

import android.app.AppOpsManager
import android.app.admin.DevicePolicyManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.smartmdm.pondok.service.TelemetryForegroundService
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

class MainActivity : AppCompatActivity() {

    private lateinit var tvDeviceId: TextView
    private lateinit var etSantriName: EditText
    private lateinit var etGroupName: EditText
    private lateinit var etServerUrl: EditText
    private lateinit var btnRegister: Button
    private lateinit var btnAutoStart: Button
    private lateinit var tvStatus: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tvDeviceId = findViewById(R.id.tvDeviceId)
        etSantriName = findViewById(R.id.etSantriName)
        etGroupName = findViewById(R.id.etGroupName)
        etServerUrl = findViewById(R.id.etServerUrl)
        btnRegister = findViewById(R.id.btnRegister)
        btnAutoStart = findViewById(R.id.btnAutoStart)
        tvStatus = findViewById(R.id.tvStatus)

        // Otomatis Deteksi ID Perangkat
        val autoDeviceId = "DEV-${Build.MANUFACTURER.uppercase()}-${Build.MODEL.uppercase().replace(" ", "-")}"
        tvDeviceId.text = autoDeviceId

        // Muat Data Registrasi dari SharedPreferences jika ada
        val prefs = getSharedPreferences("SmartMdmPrefs", Context.MODE_PRIVATE)
        val savedName = prefs.getString("santri_name", "")
        val savedGroup = prefs.getString("group_name", "")
        val savedServerUrl = prefs.getString("server_url", "http://192.168.1.100:4000")

        if (!savedName.isNullOrEmpty()) etSantriName.setText(savedName)
        if (!savedGroup.isNullOrEmpty()) etGroupName.setText(savedGroup)
        etServerUrl.setText(savedServerUrl)

        // Tombol Register & Hubungkan ke Server Admin
        btnRegister.setOnClickListener {
            val name = etSantriName.text.toString().trim()
            val group = etGroupName.text.toString().trim()
            val serverUrl = etServerUrl.text.toString().trim()

            if (name.isEmpty()) {
                Toast.makeText(this, "Mohon isi Nama Lengkap Santri!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Simpan ke SharedPreferences
            prefs.edit().apply {
                putString("santri_name", name)
                putString("group_name", if (group.isNotEmpty()) group else "Kelas X Al-Quran")
                putString("server_url", if (serverUrl.isNotEmpty()) serverUrl else "http://192.168.1.100:4000")
                apply()
            }

            Toast.makeText(this, "⏳ Menghubungkan ke Admin Server...", Toast.LENGTH_SHORT).show()

            // Daftarkan ke Backend secara Async
            registerDeviceToBackend(autoDeviceId, name, group, serverUrl)
        }

        // Tombol Izin Akses Penggunaan
        btnAutoStart.setOnClickListener {
            if (!checkUsageAccessPermission()) {
                Toast.makeText(this, "Izinkan Akses Penggunaan untuk Smart MDM Agent", Toast.LENGTH_LONG).show()
                startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
            } else {
                startMonitoringService()
            }
        }

        // Jalankan Service Telemetri secara otomatis
        startMonitoringService()
        updateStatus()
    }

    override fun onResume() {
        super.onResume()
        if (checkUsageAccessPermission()) {
            startMonitoringService()
        }
        updateStatus()
    }

    private fun registerDeviceToBackend(deviceId: String, name: String, group: String, serverUrl: String) {
        thread {
            try {
                val cleanUrl = if (serverUrl.endsWith("/")) serverUrl.dropLast(1) else serverUrl
                val targetUrl = "$cleanUrl/devices/auto-enroll"

                val json = JSONObject().apply {
                    put("serialNumber", deviceId)
                    put("deviceName", "${Build.MANUFACTURER} ${Build.MODEL} ($name)")
                    put("userName", name)
                    put("groupName", if (group.isNotEmpty()) group else "Kelas X Al-Quran")
                    put("osType", "ANDROID")
                    put("osVersion", "Android ${Build.VERSION.RELEASE}")
                    put("batteryLevel", 100)
                    put("internetType", "WIFI")
                    put("mdmStatus", if (isDeviceOwnerApp()) "DEVICE_OWNER" else "UNMANAGED")
                }

                val url = URL(targetUrl)
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "POST"
                connection.setRequestProperty("Content-Type", "application/json")
                connection.connectTimeout = 5000
                connection.readTimeout = 5000
                connection.doOutput = true
                connection.outputStream.write(json.toString().toByteArray())
                val responseCode = connection.responseCode
                connection.disconnect()

                runOnUiThread {
                    if (responseCode in 200..299) {
                        Toast.makeText(this, "✅ BERHASIL REGISTER! Santri $name Terdaftar di Dashboard Admin.", Toast.LENGTH_LONG).show()
                        startMonitoringService()
                        updateStatus()
                    } else {
                        Toast.makeText(this, "⚠️ Gagal Register (HTTP $responseCode). Cek URL Server Admin.", Toast.LENGTH_LONG).show()
                    }
                }
            } catch (e: Exception) {
                runOnUiThread {
                    Toast.makeText(this, "⚠️ Gagal terhubung ke $serverUrl. Pastikan HP & Server terhubung ke Wi-Fi yang sama.", Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    private fun startMonitoringService() {
        val serviceIntent = Intent(this, TelemetryForegroundService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }
        updateStatus()
    }

    private fun updateStatus() {
        val prefs = getSharedPreferences("SmartMdmPrefs", Context.MODE_PRIVATE)
        val registeredName = prefs.getString("santri_name", "")
        val registeredGroup = prefs.getString("group_name", "")
        val hasUsageAccess = checkUsageAccessPermission()
        val isDeviceOwner = isDeviceOwnerApp()

        if (!registeredName.isNullOrEmpty()) {
            tvStatus.text = "✅ SANTRI TERDAFTAR: $registeredName (${if (!registeredGroup.isNullOrEmpty()) registeredGroup else "Pondok"})\n" +
                    "Status Monitoring: ${if (hasUsageAccess) "AKTIF & TERHUBUNG REALTIME 🟢" else "⚠️ Perlu Izin Akses Penggunaan"}\n" +
                    "Proteksi MDM: ${if (isDeviceOwner) "TERKUNCI (SUPERVISED)" else "UNMANAGED"}"
        } else {
            tvStatus.text = "⚠️ Status: Belum Terdaftar atas Nama Santri.\nSilakan isi Nama & Kelas lalu tekan tombol Register."
        }

        if (hasUsageAccess) {
            btnAutoStart.text = "✅ IZIN AKSES PENGGUNAAN SUDAH AKTIF"
            btnAutoStart.isEnabled = false
        } else {
            btnAutoStart.text = "⚡ 1-KLIK: AKTIFKAN IZIN AKSES PENGGUNAAN"
            btnAutoStart.isEnabled = true
        }
    }

    private fun checkUsageAccessPermission(): Boolean {
        val appOps = getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            android.os.Process.myUid(),
            packageName
        )
        return mode == AppOpsManager.MODE_ALLOWED
    }

    private fun isDeviceOwnerApp(): Boolean {
        val dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        return dpm.isDeviceOwnerApp(packageName)
    }
}
