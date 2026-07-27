# Matriks Kapabilitas Resmi Sistem Operasi (Android vs iOS)
## Smart MDM Pondok

Dokumen ini menjelaskan batas-batas kapabilitas resmi yang didukung oleh **Android** dan **iOS** untuk memonitor dan mengelola perangkat santri di lingkungan Pondok Pesantren. Dokumentasi ini dibuat agar pengasuh dan pengurus memiliki ekspektasi yang realistis sesuai kebijakan privasi dan keamanan resmi Google dan Apple.

---

## 1. Ringkasan Perbandingan Kapabilitas

| Fitur Monitoring / Kebijakan | Android (Unmanaged / Usage Access) | Android Enterprise (Device Owner / Supervised) | iOS (Aplikasi Standar App Store) | iOS (Apple MDM Supervised / DeviceActivity) |
| :--- | :--- | :--- | :--- | :--- |
| **Total Screen Time Hari Ini** | ✅ Didukung (`UsageStatsManager`) | ✅ Didukung Sepenuhnya | ❌ Tidak Didukung (Sandbox Privasi Apple) | ✅ Didukung via `DeviceActivityReport` / MDM Payload |
| **Waktu Buka / Tutup Aplikasi** | ✅ Didukung (`UsageEvents`) | ✅ Didukung Sepenuhnya | ❌ Tidak Didukung | ✅ Didukung via `DeviceActivity` (Aggregated) |
| **Frekuensi Buka Aplikasi** | ✅ Didukung (`appLaunchCount`) | ✅ Didukung Sepenuhnya | ❌ Tidak Didukung | ✅ Didukung (Aggregated) |
| **Screen ON / Screen OFF Timeline** | ✅ Didukung (`KEYGUARD_HIDDEN` / `SCREEN_OFF`) | ✅ Didukung Sepenuhnya | ❌ Tidak Didukung | ⚠️ Terbatas pada timestamp sync MDM |
| **Deteksi Jam Begadang (Malam)** | ✅ Didukung (Berdasarkan timestamp event) | ✅ Didukung Sepenuhnya | ⚠️ Terbatas pada waktu heartbeat aplikasi | ✅ Didukung via telemetry data MDM |
| **Pembatasan / Blokir Aplikasi** | ⚠️ Terbatas (Membutuhkan Accessibility/AppLock Overlay) | ✅ Didukung Resmi (`setApplicationHidden` / `setPackagesSuspended`) | ❌ Tidak Didukung | ✅ Didukung Resmi (`com.apple.applicationaccess` / `ScreenTimeAPI`) |
| **Jam Tidur / Kunci Layar Otomatis** | ⚠️ Perlu Izin Device Admin / Overlay | ✅ Didukung Resmi (`lockNow` / Kunci Total) | ❌ Tidak Didukung | ✅ Didukung Resmi (MDM Lock Command / Passcode policy) |
| **Deteksi Izin Dicabut / Monitoring Stop** | ✅ Didukung (`AppOpsManager` / Heartbeat Loss) | ✅ Didukung (Pengguna tidak bisa cabut izin) | ⚠️ Terbatas via Background Push Heartbeat | ✅ Didukung (MDM Profile Removal Alert) |
| **Info Sistem (Baterai, RAM, Storage)** | ✅ Didukung (`BatteryManager`, `ActivityManager`) | ✅ Didukung Sepenuhnya | ⚠️ Terbatas (Baterai & Storage parsial) | ✅ Didukung via Inventory Payload MDM |

---

## 2. Penjelasan Detail Platform Android

### A. Mode Standar (Usage Access + Accessibility)
- **Cara Kerja**: Aplikasi agen Smart MDM diinstall di HP santri, lalu pengurus mengaktifkan izin **Usage Access** (`android.permission.PACKAGE_USAGE_STATS`).
- **Keunggulan**: Dapat membaca riwayat durasi penggunaan aplikasi, waktu pertama & terakhir HP dipakai, jumlah unlock, serta log screen ON/OFF.
- **Keterbatasan**: Jika santri sengaja mematikan izin di Settings, monitoring akan terhenti. Oleh karena itu, Smart MDM Pondok dilengkapi **Engine Kepatuhan** yang akan mengubah status perangkat menjadi **Kuning / Merah** dan mengirim notifikasi realtime ke Pengurus jika izin dicabut.

### B. Mode Android Enterprise (Device Owner / Managed Device)
- **Cara Kerja**: HP didaftarkan sebagai perangkat milik Pondok (*Device Owner*) saat setup awal via QR Code / ADB (`dpm set-device-owner`).
- **Keunggulan**:
  - Santri **TIDAK BISA** menghapus aplikasi agen MDM atau mencabut izin monitoring.
  - Pengurus dapat menerapkan **Pembatasan Aplikasi secara Resmi** (misal: menyembunyikan atau mensuspensi TikTok/Instagram/Game pada Jam Belajar & Jam Tidur).
  - Kebijakan kunci perangkat otomatis saat Jam Tidur (22.00 - 04.00).

---

## 3. Penjelasan Detail Platform iOS (iPhone / iPad)

### A. Aplikasi Standar (Tanpa MDM)
- **Kebijakan Privasi Apple**: Apple melarang keras aplikasi biasa di App Store untuk membaca aplikasi apa saja yang dibuka pengguna lain atau berapa lama pengguna membuka aplikasi tertentu.
- **Batasan**: Aplikasi iOS standar hanya bisa mengirimkan *Heartbeat* (Status Online/Offline), level baterai saat aplikasi aktif, dan menerima notifikasi dari server.

### B. Mode Apple MDM (Supervised Device / Managed)
- **Cara Kerja**: iPhone santri di-enroll ke dalam server **Apple MDM** (menggunakan profil `.mobileconfig` resmi Apple) dan di-set sebagai *Supervised Device*.
- **Keunggulan**:
  - Pengurus dapat mendistribusikan profil pembatasan (`com.apple.applicationaccess`) untuk memblokir aplikasi tertentu atau membatasi jam layar menggunakan kerangka kerja `DeviceActivity` & `FamilyControls`.
  - Apabila profil MDM dihapus oleh santri, server Smart MDM Pondok langsung menerima webhook notifikasi lepas-enrollment (*Un-enrollment Alert*) dan menandai status perangkat menjadi **Merah**.

---

## 4. Kesimpulan Implementasi Arsitektur

Smart MDM Pondok dibangun dengan pendekatan **Hybrid & Adaptive**:
1. **Dashboard Admin** menampilkan telemetry data yang seragam dari Android maupun iOS.
2. Untuk fitur yang memiliki keterbatasan di iOS (tanpa Supervised MDM), sistem menampilkan indikator *"Fitur membutuhkan Apple MDM Supervised"* dan secara aman menampilkan data yang memang tersedia tanpa mencoba menerobos batasan OS secara tidak sah.
3. Seluruh komunikasi antara perangkat dan server dilindungi dengan enkripsi SSL/TLS, otentikasi JWT, dan Audit Log lengkap.
