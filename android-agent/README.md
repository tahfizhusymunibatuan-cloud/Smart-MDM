# Smart MDM Android Native Agent (Kotlin)

Aplikasi Agen Seluler Resmi Android untuk **Smart MDM Pondok Pesantren**.

## 📱 Fitur Agen Android:
1. **Background Telemetry Service**: Mengirim heartbeat status baterai, jaringan internet, status online, dan penggunaan aplikasi setiap 30 detik ke server Smart MDM.
2. **Device Owner (Android Enterprise)**: Mencegah santri mencabut izin monitoring atau menghapus (*uninstall*) aplikasi agen MDM.
3. **Penguncian Jam Tidur Otomatis**: Menerima perintah penguncian layar instan pada pukul 22.00 - 04.00 WIB.

---

## 🛠️ 2 Cara Mudah Kompilasi & Build Berkas APK:

### Opsi 1: Kompilasi via Android Studio (Paling Mudah)
1. Buka aplikasi **Android Studio**.
2. Pilih **Open** $\rightarrow$ arahkan ke folder `d:\WEB\Smart-MDM\android-agent`.
3. Klik menu **Build** pada toolbar atas $\rightarrow$ pilih **Build Bundle(s) / APK(s)** $\rightarrow$ **Build APK(s)**.
4. Berkas `app-debug.apk` / `app-release.apk` siap digunakan!

---

### Opsi 2: Kompilasi via Terminal Windows PowerShell
Di PowerShell Windows, gunakan perintah `gradlew` berikut:
```powershell
cd d:\WEB\Smart-MDM\android-agent
gradlew assembleRelease
```
*(atau `.\gradlew.bat assembleRelease`)*

---

## 📱 Aktivasi Mode Device Owner (ADB Provisioning)
Saat setup awal HP Android santri (kondisi baru atau setelah *factory reset*):
1. Install berkas `app-release.apk` ke HP santri.
2. Hubungkan HP ke laptop via USB dan aktifkan *USB Debugging*.
3. Eksekusi perintah ADB berikut di terminal:
   ```bash
   adb shell dpm set-device-owner com.smartmdm.pondok/.receiver.SmartMdmAdminReceiver
   ```
4. Buka aplikasi **Smart MDM Agent**, izinkan **Usage Access**, lalu tekan **Mulai Monitoring**. HP santri kini terproteksi secara resmi!
