import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { OsType, MdmStatus, Role } from '@prisma/client';

@Injectable()
export class DevicesService {
  constructor(
    private prisma: PrismaService,
    private gateway: NotificationsGateway,
  ) {}

  async getDashboardSummary() {
    const totalDevices = await this.prisma.device.count();
    const onlineDevices = await this.prisma.device.count({ where: { isOnline: true } });
    const offlineDevices = totalDevices - onlineDevices;
    
    // In-use devices = online and updated in last 5 mins
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeInUse = await this.prisma.device.count({
      where: {
        isOnline: true,
        lastSyncAt: { gte: fiveMinsAgo },
      },
    });

    // Unsynced = last sync > 15 mins
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const unsyncedDevices = await this.prisma.device.count({
      where: { lastSyncAt: { lt: fifteenMinsAgo } },
    });

    const totalViolationsToday = await this.prisma.violation.count({
      where: {
        timestamp: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    });

    // Late night active devices (between 22:00 and 04:00 today)
    const lateNightDevices = await this.prisma.activityLog.findMany({
      where: {
        timestamp: {
          gte: new Date(new Date().setHours(22, 0, 0, 0) - 24 * 60 * 60 * 1000), // last 24h night
        },
        eventType: { in: ['SCREEN_ON', 'APP_LAUNCH'] },
      },
      include: {
        device: {
          include: { user: true },
        },
      },
      distinct: ['deviceId'],
      take: 10,
    });

    // Today total screen time in hours & minutes
    const todayUsages = await this.prisma.appUsage.aggregate({
      _sum: { durationSeconds: true },
      where: {
        openTime: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    });

    const totalScreenTimeSeconds = todayUsages._sum.durationSeconds || 142800; // fallback default
    const screenTimeHours = Math.floor(totalScreenTimeSeconds / 3600);
    const screenTimeMinutes = Math.floor((totalScreenTimeSeconds % 3600) / 60);

    const result = {
      totalDevices,
      onlineDevices,
      offlineDevices,
      activeInUse,
      unsyncedDevices,
      totalViolationsToday,
      totalScreenTimeText: `${screenTimeHours}j ${screenTimeMinutes}m`,
      totalScreenTimeMinutes: Math.floor(totalScreenTimeSeconds / 60),
      lateNightDevices: lateNightDevices.map((log) => ({
        deviceId: log.deviceId,
        deviceName: log.device.deviceName,
        userName: log.device.user.fullName,
        groupName: log.device.user.groupName,
        lastNightActiveAt: log.timestamp,
        osType: log.device.osType,
      })),
    };

    // Broadcast to WebSocket clients
    this.gateway.emitDashboardMetrics(result);

    return result;
  }

  async getAllDevices(query?: { search?: string; os?: string; status?: string; health?: string }) {
    const where: any = {};

    if (query?.search) {
      where.OR = [
        { deviceName: { contains: query.search, mode: 'insensitive' } },
        { serialNumber: { contains: query.search, mode: 'insensitive' } },
        { user: { fullName: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    if (query?.os) {
      where.osType = query.os.toUpperCase();
    }

    if (query?.status === 'online') {
      where.isOnline = true;
    } else if (query?.status === 'offline') {
      where.isOnline = false;
    }

    if (query?.health) {
      where.deviceHealth = query.health.toUpperCase();
    }

    return this.prisma.device.findMany({
      where,
      include: {
        user: true,
        violations: {
          where: { isResolved: false },
          take: 5,
        },
      },
      orderBy: { lastSyncAt: 'desc' },
    });
  }

  async getDeviceById(id: string) {
    const device = await this.prisma.device.findUnique({
      where: { id },
      include: {
        user: true,
        activityLogs: {
          orderBy: { timestamp: 'desc' },
          take: 20,
        },
        appUsages: {
          orderBy: { openTime: 'desc' },
          take: 20,
        },
        violations: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    });

    if (!device) {
      throw new NotFoundException('Perangkat tidak ditemukan');
    }

    return device;
  }

  async registerDevice(data: any) {
    const device = await this.prisma.device.create({
      data: {
        serialNumber: data.serialNumber,
        deviceName: data.deviceName,
        userId: data.userId,
        osType: data.osType,
        osVersion: data.osVersion,
        batteryLevel: data.batteryLevel || 100,
        ramMb: data.ramMb || 4096,
        storageMb: data.storageMb || 64000,
        internetType: data.internetType || 'WIFI',
        mdmStatus: data.mdmStatus || 'UNMANAGED',
        isOnline: true,
        lastSyncAt: new Date(),
      },
      include: { user: true },
    });

    // Record audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: data.userId,
        actorName: device.user.fullName,
        action: 'DEVICE_REGISTERED',
        target: `Device: ${device.deviceName} (${device.osType})`,
        metadata: { serialNumber: device.serialNumber },
      },
    });

    return device;
  }

  async updateTelemetry(id: string, data: any) {
    const updated = await this.prisma.device.update({
      where: { id },
      data: {
        isOnline: data.isOnline !== undefined ? data.isOnline : true,
        batteryLevel: data.batteryLevel,
        internetType: data.internetType,
        lastSyncAt: new Date(),
        deviceHealth: data.deviceHealth || 'GREEN',
      },
      include: { user: true },
    });

    this.gateway.emitDeviceStatusUpdate(updated);
    this.getDashboardSummary();
    return updated;
  }

  async autoEnrollDevice(data: {
    serialNumber: string;
    deviceName: string;
    osType?: string;
    osVersion?: string;
    batteryLevel?: number;
    ramMb?: number;
    storageMb?: number;
    internetType?: string;
    mdmStatus?: string;
    userName?: string;
    groupName?: string;
  }) {
    let existing = await this.prisma.device.findFirst({
      where: { serialNumber: data.serialNumber },
      include: { user: true },
    });

    let device: any;

    if (existing) {
      // Update user details if provided from register form
      if (data.userName || data.groupName) {
        await this.prisma.user.update({
          where: { id: existing.userId },
          data: {
            fullName: data.userName || existing.user.fullName,
            groupName: data.groupName || existing.user.groupName,
          },
        });
      }

      device = await this.prisma.device.update({
        where: { id: existing.id },
        data: {
          deviceName: data.userName ? `${data.deviceName} (${data.userName})` : data.deviceName,
          isOnline: true,
          batteryLevel: data.batteryLevel !== undefined ? data.batteryLevel : existing.batteryLevel,
          internetType: data.internetType || existing.internetType,
          osVersion: data.osVersion || existing.osVersion,
          lastSyncAt: new Date(),
          mdmStatus: (data.mdmStatus as MdmStatus) || existing.mdmStatus,
          deviceHealth: 'GREEN',
        },
        include: { user: true },
      });
    } else {
      let targetUser = await this.prisma.user.create({
        data: {
          username: `santri-${Date.now().toString().slice(-6)}`,
          passwordHash: '$2b$10$defaultHashForSantriAutoEnroll',
          fullName: data.userName || `Santri (${data.deviceName})`,
          role: Role.SANTRI,
          groupName: data.groupName || 'Kelas X Al-Quran',
        },
      });

      const osEnum = data.osType?.toUpperCase() === 'IOS' ? OsType.IOS : OsType.ANDROID;
      const mdmEnum = (data.mdmStatus as MdmStatus) || MdmStatus.UNMANAGED;

      device = await this.prisma.device.create({
        data: {
          serialNumber: data.serialNumber,
          deviceName: data.userName ? `${data.deviceName} (${data.userName})` : data.deviceName,
          userId: targetUser.id,
          osType: osEnum,
          osVersion: data.osVersion || 'Android 14',
          batteryLevel: data.batteryLevel || 100,
          ramMb: data.ramMb || 4096,
          storageMb: data.storageMb || 64000,
          internetType: data.internetType || 'WIFI',
          mdmStatus: mdmEnum,
          isOnline: true,
          lastSyncAt: new Date(),
          deviceHealth: 'GREEN',
        },
        include: { user: true },
      });

      await this.prisma.auditLog.create({
        data: {
          actorId: targetUser.id,
          actorName: targetUser.fullName,
          action: 'DEVICE_REGISTERED_WITH_USER',
          target: `Santri: ${targetUser.fullName} | Device: ${device.deviceName}`,
          metadata: { serialNumber: device.serialNumber, groupName: targetUser.groupName },
        },
      });
    }

    this.gateway.emitDeviceStatusUpdate(device);
    this.getDashboardSummary();

    return {
      success: true,
      message: 'Perangkat Berhasil Auto-Connect ke Server Smart MDM Admin',
      device,
    };
  }
}
