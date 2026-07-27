import { PrismaClient, Role, OsType, MdmStatus, DeviceHealth, ViolationType, PolicyType, TargetType } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Smart MDM Pondok database seeding...');

  // 1. Password hashing
  const defaultPassword = await argon2.hash('AdminSmart123!');
  const santriPassword = await argon2.hash('SantriSmart123!');

  // 2. System Settings
  await prisma.systemSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      pondokName: 'Pondok Pesantren Tahfizh Quran Al-Usymuni Smart MDM',
      bedtimeStart: '22:00',
      bedtimeEnd: '04:00',
      studyStart: '08:00',
      studyEnd: '11:30',
      ngajiStart: '18:00',
      ngajiEnd: '20:00',
      syncThresholdMinutes: 15,
    },
  });

  // 3. Admin & User Seed
  const superAdmin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: defaultPassword,
      fullName: 'Khairol Anam (Super Admin)',
      role: Role.SUPER_ADMIN,
      phone: '081234567890',
    },
  });

  const pengurus = await prisma.user.upsert({
    where: { username: 'pengurus' },
    update: {},
    create: {
      username: 'pengurus',
      passwordHash: defaultPassword,
      fullName: 'Ust. H. Ridwan, S.Pd',
      role: Role.PENGURUS,
      phone: '081987654321',
    },
  });

  const pengasuh = await prisma.user.upsert({
    where: { username: 'kyai_ahmad' },
    update: {},
    create: {
      username: 'kyai_ahmad',
      passwordHash: defaultPassword,
      fullName: 'KH. Ahmad Dahlan (Pengasuh)',
      role: Role.PENGASUH,
      phone: '081122334455',
    },
  });

  // Santri Users
  const santriList = [
    { username: 'ahmad_fadhil', fullName: 'Ahmad Fadhil', groupName: "Kamar As-Syafi'i" },
    { username: 'muhammad_rizky', fullName: 'Muhammad Rizky', groupName: "Kamar As-Syafi'i" },
    { username: 'umar_faruq', fullName: 'Umar Al-Faruq', groupName: 'Kamar Al-Ghazali' },
    { username: 'ali_zaineddin', fullName: 'Ali Zaineddin', groupName: 'Kamar Al-Ghazali' },
    { username: 'fatimah_zahra', fullName: 'Fatimah Az-Zahra', groupName: 'Kamar An-Nisa 1' },
    { username: 'siti_khadijah', fullName: 'Siti Khadijah', groupName: 'Kamar An-Nisa 1' },
  ];

  const createdSantri = [];
  for (const s of santriList) {
    const u = await prisma.user.upsert({
      where: { username: s.username },
      update: {
        passwordHash: santriPassword,
      },
      create: {
        username: s.username,
        passwordHash: santriPassword,
        fullName: s.fullName,
        role: Role.SANTRI,
        groupName: s.groupName,
      },
    });
    createdSantri.push(u);
  }

  // 4. Device Seed
  const devicesData = [
    {
      serialNumber: 'SN-SAMSUNG-A54-001',
      deviceName: 'Samsung Galaxy A54 5G',
      userId: createdSantri[0].id,
      osType: OsType.ANDROID,
      osVersion: 'Android 14 (One UI 6.0)',
      isOnline: true,
      batteryLevel: 88,
      ramMb: 8192,
      storageMb: 256000,
      internetType: 'WIFI',
      mdmStatus: MdmStatus.DEVICE_OWNER,
      deviceHealth: DeviceHealth.GREEN,
    },
    {
      serialNumber: 'SN-REDMI-NOTE12-002',
      deviceName: 'Redmi Note 12 Pro',
      userId: createdSantri[1].id,
      osType: OsType.ANDROID,
      osVersion: 'Android 13 (MIUI 14)',
      isOnline: true,
      batteryLevel: 42,
      ramMb: 6144,
      storageMb: 128000,
      internetType: 'WIFI',
      mdmStatus: MdmStatus.ACCESSIBILITY_USAGE,
      deviceHealth: DeviceHealth.YELLOW, // Low sync warning
    },
    {
      serialNumber: 'SN-IPHONE13-003',
      deviceName: 'iPhone 13 Mini',
      userId: createdSantri[2].id,
      osType: OsType.IOS,
      osVersion: 'iOS 17.3',
      isOnline: true,
      batteryLevel: 95,
      ramMb: 4096,
      storageMb: 128000,
      internetType: 'CELLULAR',
      mdmStatus: MdmStatus.APPLE_MDM,
      deviceHealth: DeviceHealth.GREEN,
    },
    {
      serialNumber: 'SN-OPPO-RENO8-004',
      deviceName: 'Oppo Reno 8 T',
      userId: createdSantri[3].id,
      osType: OsType.ANDROID,
      osVersion: 'Android 13 (ColorOS 13)',
      isOnline: false,
      batteryLevel: 12,
      ramMb: 8192,
      storageMb: 256000,
      internetType: 'NONE',
      mdmStatus: MdmStatus.UNMANAGED,
      deviceHealth: DeviceHealth.RED, // Unsynced / low battery
    },
    {
      serialNumber: 'SN-IPHONE12-005',
      deviceName: 'iPhone 12 Standard',
      userId: createdSantri[4].id,
      osType: OsType.IOS,
      osVersion: 'iOS 16.6',
      isOnline: true,
      batteryLevel: 75,
      ramMb: 4096,
      storageMb: 64000,
      internetType: 'WIFI',
      mdmStatus: MdmStatus.APPLE_MDM,
      deviceHealth: DeviceHealth.GREEN,
    },
    {
      serialNumber: 'SN-VIVO-Y36-006',
      deviceName: 'Vivo Y36 4G',
      userId: createdSantri[5].id,
      osType: OsType.ANDROID,
      osVersion: 'Android 13 (Funtouch 13)',
      isOnline: true,
      batteryLevel: 64,
      ramMb: 8192,
      storageMb: 128000,
      internetType: 'WIFI',
      mdmStatus: MdmStatus.DEVICE_OWNER,
      deviceHealth: DeviceHealth.GREEN,
    },
  ];

  const createdDevices = [];
  for (const d of devicesData) {
    const dev = await prisma.device.upsert({
      where: { serialNumber: d.serialNumber },
      update: {},
      create: d,
    });
    createdDevices.push(dev);
  }

  // 5. Activity Logs (Interactive Timeline)
  const todayStr = new Date().toISOString().split('T')[0];
  const sampleDevice = createdDevices[0];

  const timelineLogs = [
    { eventType: 'SCREEN_ON', appName: 'Keyguard Screen', packageName: 'com.android.systemui', durationSeconds: 120, time: '05.12' },
    { eventType: 'APP_LAUNCH', appName: 'WhatsApp', packageName: 'com.whatsapp', durationSeconds: 960, time: '05.14' },
    { eventType: 'APP_LAUNCH', appName: 'Google Chrome', packageName: 'com.android.chrome', durationSeconds: 1800, time: '05.30' },
    { eventType: 'SCREEN_OFF', appName: null, packageName: null, durationSeconds: 0, time: '06.00' },
    { eventType: 'SCREEN_ON', appName: 'Keyguard Screen', packageName: 'com.android.systemui', durationSeconds: 60, time: '08.20' },
    { eventType: 'APP_LAUNCH', appName: 'TikTok', packageName: 'com.zhiliaoapp.musically', durationSeconds: 3000, time: '08.21' },
    { eventType: 'SCREEN_OFF', appName: null, packageName: null, durationSeconds: 0, time: '09.10' },
    { eventType: 'SCREEN_ON', appName: 'Keyguard Screen', packageName: 'com.android.systemui', durationSeconds: 60, time: '22.15' },
    { eventType: 'APP_LAUNCH', appName: 'YouTube', packageName: 'com.google.android.youtube', durationSeconds: 8820, time: '22.16' },
    { eventType: 'SCREEN_OFF', appName: null, packageName: null, durationSeconds: 0, time: '00.42' },
  ];

  for (const log of timelineLogs) {
    const [hours, mins] = log.time.split('.').map(Number);
    const dateObj = new Date(`${todayStr}T00:00:00.000Z`);
    dateObj.setHours(hours, mins, 0, 0);

    await prisma.activityLog.create({
      data: {
        deviceId: sampleDevice.id,
        eventType: log.eventType,
        appName: log.appName,
        packageName: log.packageName,
        durationSeconds: log.durationSeconds,
        timestamp: dateObj,
      },
    });
  }

  // 6. App Usage Stats
  const appUsageData = [
    { appName: 'YouTube', packageName: 'com.google.android.youtube', durationSeconds: 9400, launchCount: 14 },
    { appName: 'TikTok', packageName: 'com.zhiliaoapp.musically', durationSeconds: 6200, launchCount: 22 },
    { appName: 'WhatsApp', packageName: 'com.whatsapp', durationSeconds: 5800, launchCount: 38 },
    { appName: 'Mobile Legends', packageName: 'com.mobile.legends', durationSeconds: 4500, launchCount: 5 },
    { appName: 'Google Chrome', packageName: 'com.android.chrome', durationSeconds: 3200, launchCount: 11 },
    { appName: 'Instagram', packageName: 'com.instagram.android', durationSeconds: 2800, launchCount: 18 },
  ];

  for (const app of appUsageData) {
    await prisma.appUsage.create({
      data: {
        deviceId: sampleDevice.id,
        appName: app.appName,
        packageName: app.packageName,
        openTime: new Date(Date.now() - 3 * 3600 * 1000),
        closeTime: new Date(),
        durationSeconds: app.durationSeconds,
        launchCount: app.launchCount,
        date: todayStr,
      },
    });
  }

  // 7. Policy Seed
  await prisma.policy.create({
    data: {
      title: 'Jam Tidur Santri (22.00 - 04.00)',
      policyType: PolicyType.BEDTIME,
      startTime: '22:00',
      endTime: '04:00',
      targetType: TargetType.ALL,
      isEnabled: true,
      restrictions: {
        create: [
          { appName: 'TikTok', packageName: 'com.zhiliaoapp.musically' },
          { appName: 'Instagram', packageName: 'com.instagram.android' },
          { appName: 'YouTube', packageName: 'com.google.android.youtube' },
          { appName: 'Mobile Legends', packageName: 'com.mobile.legends' },
        ],
      },
    },
  });

  await prisma.policy.create({
    data: {
      title: 'Jam Belajar Formal (08.00 - 11.30)',
      policyType: PolicyType.STUDY,
      startTime: '08:00',
      endTime: '11:30',
      targetType: TargetType.ALL,
      isEnabled: true,
      restrictions: {
        create: [
          { appName: 'Mobile Legends', packageName: 'com.mobile.legends' },
          { appName: 'TikTok', packageName: 'com.zhiliaoapp.musically' },
        ],
      },
    },
  });

  await prisma.policy.create({
    data: {
      title: 'Jam Mengaji & Dzikir Malam (18.00 - 20.00)',
      policyType: PolicyType.NGAJI,
      startTime: '18:00',
      endTime: '20:00',
      targetType: TargetType.ALL,
      isEnabled: true,
    },
  });

  // 8. Violations Seed
  await prisma.violation.create({
    data: {
      deviceId: createdDevices[1].id,
      userId: createdSantri[1].id,
      violationType: ViolationType.LATE_NIGHT_USAGE,
      description: 'Penggunaan perangkat masih aktif pukul 00.55 WIB (Aplikasi TikTok)',
      severity: 'HIGH',
      timestamp: new Date(Date.now() - 4 * 3600 * 1000),
    },
  });

  await prisma.violation.create({
    data: {
      deviceId: createdDevices[3].id,
      userId: createdSantri[3].id,
      violationType: ViolationType.UN_SYNCED,
      description: 'Perangkat tidak melakukan sinkronisasi lebih dari 2 jam',
      severity: 'CRITICAL',
      timestamp: new Date(Date.now() - 2 * 3600 * 1000),
    },
  });

  // 9. Notifications Seed
  await prisma.notification.create({
    data: {
      title: 'Device Begadang Terdeteksi',
      message: 'Perangkat Redmi Note 12 Pro (Muhammad Rizky) aktif hingga pukul 00.55 WIB.',
      type: 'WARNING',
      deviceId: createdDevices[1].id,
    },
  });

  await prisma.notification.create({
    data: {
      title: 'Perangkat Tidak Sinkron',
      message: 'Oppo Reno 8 T (Ali Zaineddin) dalam status Offline / Tidak Sinkron.',
      type: 'DANGER',
      deviceId: createdDevices[3].id,
    },
  });

  // 10. Audit Logs Seed
  await prisma.auditLog.create({
    data: {
      actorId: superAdmin.id,
      actorName: superAdmin.fullName,
      action: 'POLICY_UPDATED',
      target: 'Kebijakan: Jam Tidur Santri',
      metadata: { startTime: '22:00', endTime: '04:00' },
      timestamp: new Date(Date.now() - 2 * 3600 * 1000),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: pengurus.id,
      actorName: pengurus.fullName,
      action: 'MONITORING_TOGGLED',
      target: 'Device: Samsung Galaxy A54 5G',
      metadata: { status: 'ACTIVE' },
      timestamp: new Date(Date.now() - 1 * 3600 * 1000),
    },
  });

  // 11. AI Daily Summary
  await prisma.aISummary.upsert({
    where: { date: todayStr },
    update: {
      summaryText:
        'Hari ini terdapat 4 perangkat yang masih aktif setelah pukul 22.00. Rata-rata screen time santri meningkat 18% dibanding kemarin. Tiga santri di Kamar As-Syafi\'i menunjukkan pola begadang selama tiga hari berturut-turut.',
      lateNightCount: 4,
      avgScreenTimeMinutes: 245,
      riskLevel: 'MEDIUM',
      recommendations: [
        'Lakukan evaluasi kedisiplinan malam untuk santri di Kamar As-Syafi\'i.',
        'Pastikan fitur Penguncian Jam Tidur (22.00 - 04.00) aktif pada seluruh perangkat Android Enterprise.',
        'Berikan bimbingan konseling pribadi untuk santri dengan durasi YouTube > 3 jam per hari.',
      ],
    },
    create: {
      date: todayStr,
      summaryText:
        'Hari ini terdapat 4 perangkat yang masih aktif setelah pukul 22.00. Rata-rata screen time santri meningkat 18% dibanding kemarin. Tiga santri di Kamar As-Syafi\'i menunjukkan pola begadang selama tiga hari berturut-turut.',
      lateNightCount: 4,
      avgScreenTimeMinutes: 245,
      riskLevel: 'MEDIUM',
      recommendations: [
        'Lakukan evaluasi kedisiplinan malam untuk santri di Kamar As-Syafi\'i.',
        'Pastikan fitur Penguncian Jam Tidur (22.00 - 04.00) aktif pada seluruh perangkat Android Enterprise.',
        'Berikan bimbingan konseling pribadi untuk santri dengan durasi YouTube > 3 jam per hari.',
      ],
    },
  });

  console.log('✅ Smart MDM Pondok database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
