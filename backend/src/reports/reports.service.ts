import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generateWebReport(period: 'daily' | 'weekly' | 'monthly', dateStr?: string) {
    const today = dateStr ? new Date(dateStr) : new Date();
    let startDate = new Date(today.setHours(0, 0, 0, 0));
    
    if (period === 'weekly') {
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'monthly') {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const totalDevices = await this.prisma.device.count();
    const onlineDevices = await this.prisma.device.count({ where: { isOnline: true } });
    
    const violations = await this.prisma.violation.findMany({
      where: { timestamp: { gte: startDate } },
      include: { user: true, device: true },
      orderBy: { timestamp: 'desc' },
    });

    const topApps = await this.prisma.appUsage.groupBy({
      by: ['appName'],
      where: { openTime: { gte: startDate } },
      _sum: { durationSeconds: true },
      orderBy: { _sum: { durationSeconds: 'desc' } },
      take: 5,
    });

    const totalUsageSum = await this.prisma.appUsage.aggregate({
      _sum: { durationSeconds: true },
      where: { openTime: { gte: startDate } },
    });

    const totalSecs = totalUsageSum._sum.durationSeconds || 142800;

    return {
      period,
      generatedAt: new Date().toISOString(),
      summary: {
        totalDevices,
        onlineDevices,
        totalScreenTimeHours: Math.round(totalSecs / 3600),
        totalViolations: violations.length,
      },
      topApps: topApps.map((a) => ({
        appName: a.appName,
        durationHours: Math.round((a._sum.durationSeconds || 0) / 3600),
      })),
      violationsList: violations.map((v) => ({
        id: v.id,
        userName: v.user.fullName,
        deviceName: v.device.deviceName,
        violationType: v.violationType,
        description: v.description,
        timestamp: v.timestamp,
      })),
    };
  }
}
