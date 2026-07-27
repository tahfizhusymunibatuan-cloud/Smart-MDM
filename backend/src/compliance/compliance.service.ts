import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ComplianceService {
  constructor(
    private prisma: PrismaService,
    private notifService: NotificationsService,
  ) {}

  async runComplianceCheck() {
    const devices = await this.prisma.device.findMany({
      include: { user: true },
    });

    const now = new Date();
    const fifteenMinsAgo = new Date(now.getTime() - 15 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const complianceResults = [];

    for (const device of devices) {
      let health = 'GREEN';
      const issues: string[] = [];

      if (!device.monitoringActive) {
        health = 'RED';
        issues.push('Monitoring terhenti / dinonaktifkan');
      }

      if (device.lastSyncAt < oneHourAgo) {
        health = 'RED';
        issues.push(`Tidak sinkron sejak ${device.lastSyncAt.toLocaleString('id-ID')}`);
      } else if (device.lastSyncAt < fifteenMinsAgo) {
        if (health !== 'RED') health = 'YELLOW';
        issues.push('Sinkronisasi lambat (>15 menit)');
      }

      if (device.batteryLevel <= 15 && device.isOnline) {
        if (health !== 'RED') health = 'YELLOW';
        issues.push(`Baterai sangat rendah (${device.batteryLevel}%)`);
      }

      // Update device health status
      await this.prisma.device.update({
        where: { id: device.id },
        data: { deviceHealth: health as any },
      });

      // If RED, create notification if not created recently
      if (health === 'RED') {
        await this.notifService.createNotification(
          `Peringatan Kepatuhan: ${device.deviceName}`,
          `Device ${device.deviceName} (${device.user.fullName}) dalam kondisi TIDAK AKTIF/KRITIS: ${issues.join(', ')}`,
          'DANGER',
          device.id,
        );
      }

      complianceResults.push({
        deviceId: device.id,
        deviceName: device.deviceName,
        userName: device.user.fullName,
        groupName: device.user.groupName,
        osType: device.osType,
        deviceHealth: health,
        issues,
        lastSyncAt: device.lastSyncAt,
      });
    }

    return complianceResults;
  }

  async getComplianceSummary() {
    const total = await this.prisma.device.count();
    const greenCount = await this.prisma.device.count({ where: { deviceHealth: 'GREEN' } });
    const yellowCount = await this.prisma.device.count({ where: { deviceHealth: 'YELLOW' } });
    const redCount = await this.prisma.device.count({ where: { deviceHealth: 'RED' } });

    const recentViolations = await this.prisma.violation.findMany({
      include: { device: true, user: true },
      orderBy: { timestamp: 'desc' },
      take: 20,
    });

    return {
      total,
      greenCount,
      yellowCount,
      redCount,
      recentViolations: recentViolations.map((v) => ({
        id: v.id,
        userName: v.user.fullName,
        deviceName: v.device.deviceName,
        violationType: v.violationType,
        description: v.description,
        severity: v.severity,
        timestamp: v.timestamp,
        isResolved: v.isResolved,
      })),
    };
  }
}
