# Panduan Instalasi Smart MDM: File APK (Android) & iPhone (iOS)

Dokumen ini berisi panduan lengkap untuk memasang dan menjalankan **Smart MDM** pada perangkat **Android** dan **iPhone (iOS)**, baik untuk **Agen Monitoring HP Santri** maupun **Dashboard Admin / Pengurus**.

---

## 📱 1. Aplikasi Agen Monitoring Santri (HP Santri)

### A. Android (Membuat Berkas `.apk` & Instalasi HP Santri)

#### Langkah 1: Kompilasi / Build Berkas APK
1. Buka folder `d:\WEB\Smart-MDM\android-agent` di komputer Anda.
2. Klik 2x pada file **`build-apk.bat`** (atau jalankan perintah di CMD/PowerShell):
   ```cmd
   cd d:\WEB\Smart-MDM\android-agent
   build-apk.bat
   ```
3. File **`smart-mdm-agent.apk`** akan otomatis dibuat di folder `android-agent`.

#### Langkah 2: Instalasi & Otomatis Terhubung ke Dashboard Admin (100% Tanpa Kabel USB!)
1. Kirim & install berkas `smart-mdm-agent.apk` ke HP Android santri (via WhatsApp, Google Drive, atau Bluetooth).
2. Buka aplikasi **Smart MDM Agent** di HP santri.
3. Aplikasi akan **langsung otomatis mendaftarkan perangkat secara nirkabel (wireless)** ke Dashboard Server Admin!
4. Berikan izin **Usage Access** (Akses Penggunaan) saat diminta agar agen dapat membaca waktu pemakaian layar & aplikasi santri.
5. Selesai! Perangkat santri langsung muncul dengan status 🟢 **ONLINE** di Dashboard Admin secara realtime tanpa perlu disambungkan ke komputer atau kabel USB.

> [!TIP]
> **Opsional (Proteksi Anti-Uninstall / Device Owner via ADB)**:
> Jika pengurus ingin **mencegah santri menghapus (*uninstall*) aplikasi**, hubungkan kabel USB sekali saja dan jalankan perintah ADB berikut:
> ```bash
> adb shell dpm set-device-owner com.smartmdm.pondok/.receiver.SmartMdmAdminReceiver
> ```
> *(Langkah ADB ini bersifat opsional. Tanpa ADB pun, perangkat tetap 100% otomatis terhubung dan terbaca di Admin Dashboard).*

---

### B. iPhone / iOS (Pendaftaran MDM & Profil Pembatasan)

iPhone menggunakan sistem enkapsulasi profil Apple MDM resmi (`.mobileconfig`).

#### Langkah Pendaftaran iPhone Santri:
1. Kirim file **`smart-mdm-iphone-profile.mobileconfig`** ke iPhone santri (bisa via AirDrop, Email, WhatsApp, atau unduh via browser Safari).
2. Buka file profil tersebut di iPhone. Sistem iOS akan menampilkan notifikasi **"Profile Downloaded"**.
3. Buka **Pengaturan (Settings)** di iPhone -> ketuk **Profile Downloaded** pada bagian atas.
4. Ketuk **Install** di pojok kanan atas dan masukkan passcode iPhone.
5. Konfirmasi **Install** hingga status profil menjadi **Active / Verified**.

> [!NOTE]
> Profil ini dikonfigurasi dengan `PayloadRemovalDisallowed = true`, sehingga santri tidak dapat menghapus profil pembatasan ini secara sembarangan. Aplikasi seperti TikTok, Instagram, YouTube, dan Game akan dibatasi sesuai kebijakan pondok.

---

## 💻 2. Dashboard Admin & Pengurus (Android & iPhone PWA)

Dashboard Admin Smart MDM telah dilengkapi fitur **PWA (Progressive Web App)** sehingga dapat dipasang langsung di layar utama HP Android & iPhone seperti aplikasi native dari App Store / Play Store.

### A. Cara Install di iPhone (iOS Safari)
1. Buka browser **Safari** di iPhone Anda.
2. Akses alamat URL Dashboard Smart MDM Anda (contoh: `https://mdm.pondok-al-usymuni.com` atau IP server lokasi).
3. Ketuk tombol **Share (Bagikan)** di bagian bawah layar Safari (ikon kotak dengan panah ke atas <share>).
4. Gulir ke bawah lalu pilih **Tambahkan ke Layar Utama (Add to Home Screen)**.
5. Ketuk **Tambah (Add)** di pojok kanan atas.
6. Aplikasi **Smart MDM** kini sudah terpasang di layar utama iPhone Anda!

---

### B. Cara Install di HP Android (Chrome / Edge / Brave)
1. Buka browser **Google Chrome** di HP Android Anda.
2. Akses alamat URL Dashboard Smart MDM.
3. Tombol floating **"Install Smart MDM App"** akan otomatis muncul di bagian bawah layar.
4. Ketuk tombol **Install**, atau buka menu titik 3 di kanan atas Chrome -> pilih **Install Aplikasi / Tambahkan ke Layar Utama**.
5. Aplikasi akan terpasang di App Drawer & Home Screen Android Anda.

---

### C. Cara Mengubah Web Dashboard Menjadi Berkas APK Standalone (Google Play / APK Direct)
Jika pengurus ingin membagikan berkas file `.apk` mentah untuk Dashboard Admin:
1. Jalankan `npm run build` pada folder `frontend`.
2. Buka situs gratis [PWA Builder (pwabuilder.com)](https://www.pwabuilder.com/).
3. Masukkan URL domain Web Dashboard Anda.
4. Klik **Build My APK** -> PWA Builder akan langsung mendownload berkas `.apk` instan yang siap di-install di HP Android manapun.

---

## 📊 Matriks Dukungan Perangkat Smart MDM

| Perangkat / OS | Metode Monitoring Santri | Metode Dashboard Admin |
| :--- | :--- | :--- |
| **Android (HP Santri)** | Berkas `smart-mdm-agent.apk` + Device Owner ADB | Web Browser / PWA App |
| **iPhone (iOS Santri)** | Profil `.mobileconfig` + Safari Web Agent | Web Browser / Safari PWA |
| **Android (Pengurus)** | - | PWA Home Screen / APK Standalone |
| **iPhone (Pengurus)** | - | Safari Add to Home Screen (PWA) |
