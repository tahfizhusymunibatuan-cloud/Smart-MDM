@echo off
echo ========================================================
echo   Smart MDM Android Agent - APK Build Script
echo ========================================================
echo.

cd /d "%~dp0"

@rem Detect Android Studio JDK if JAVA_HOME is not set
if not defined JAVA_HOME (
    if exist "C:\Program Files\Android\Android Studio\jbr" (
        set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
        echo [INFO] Menggunakan JDK dari Android Studio: %JAVA_HOME%
    ) else if exist "C:\Program Files\Android\Android Studio\jre" (
        set "JAVA_HOME=C:\Program Files\Android\Android Studio\jre"
        echo [INFO] Menggunakan JRE dari Android Studio: %JAVA_HOME%
    )
)

if defined JAVA_HOME (
    set "PATH=%JAVA_HOME%\bin;%PATH%"
)

@rem Check if gradlew.bat or gradle exists
set BUILD_CMD=gradlew.bat
where gradlew.bat >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    where gradle >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        set BUILD_CMD=gradle
    )
)

echo [1/3] Membersihkan direktori build lama...
call %BUILD_CMD% clean 2>nul

echo.
echo [2/3] Memulai kompilasi Release APK...
call %BUILD_CMD% assembleRelease

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [INFO] Mencoba kompilasi Debug APK...
    call %BUILD_CMD% assembleDebug
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ========================================================
        echo [CATATAN UNTUK PENGGUNA]:
        echo Jika kompilasi via Terminal belum terpasang JDK 17 / Gradle:
        echo 1. Buka aplikasi **Android Studio**.
        echo 2. Open folder `d:\WEB\Smart-MDM\android-agent`.
        echo 3. Klik menu **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
        echo ========================================================
        echo.
        pause
        exit /b 1
    )
    copy /Y "app\build\outputs\apk\debug\app-debug.apk" "smart-mdm-agent.apk"
    goto success
)

copy /Y "app\build\outputs\apk\release\app-release-unsigned.apk" "smart-mdm-agent.apk" 2>nul || copy /Y "app\build\outputs\apk\release\app-release.apk" "smart-mdm-agent.apk" 2>nul || copy /Y "app\build\outputs\apk\debug\app-debug.apk" "smart-mdm-agent.apk"

:success
echo.
echo ========================================================
echo   BERHASIL! Berkas APK Agen Android Siap:
echo   Path: %~dp0smart-mdm-agent.apk
echo ========================================================
echo.
echo Langkah Mudah HP Santri (100%% Tanpa Kabel USB):
echo 1. Kirim & Install smart-mdm-agent.apk ke HP Santri.
echo 2. Buka aplikasi Smart MDM Agent & berikan izin Akses Penggunaan.
echo 3. Perangkat langsung 🟢 ONLINE & terhubung ke Dashboard Admin!
echo ========================================================
pause
