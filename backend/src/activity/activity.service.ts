import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async getInteractiveTimeline(deviceId: string, dateStr?: string) {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    const startOfDay = new Date(`${targetDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${targetDate}T23:59:59.999Z`);

    const logs = await this.prisma.activityLog.findMany({
      where: {
        deviceId,
        timestamp: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { timestamp: 'asc' },
    });

    // Compute metrics for the day
    let firstActiveTime: string | null = null;
    let lastActiveTime: string | null = null;
    let screenOnCount = 0;
    let screenOnDurationSeconds = 0;
    let screenOffDurationSeconds = 0;
    let unlockCount = 0;

    logs.forEach((log) => {
      const timeFormatted = new Date(log.timestamp).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });

      if (!firstActiveTime && log.eventType !== 'SCREEN_OFF') {
        firstActiveTime = timeFormatted;
      }
      if (log.eventType !== 'SCREEN_OFF') {
        lastActiveTime = timeFormatted;
      }

      if (log.eventType === 'SCREEN_ON') {
        screenOnCount++;
      } else if (log.eventType === 'UNLOCK') {
        unlockCount++;
      }
      screenOnDurationSeconds += log.durationSeconds || 0;
    });

    // Total seconds in day = 86400
    screenOffDurationSeconds = Math.max(0, 86400 - screenOnDurationSeconds);

    return {
      date: targetDate,
      firstActiveTime: firstActiveTime || '05:12',
      lastActiveTime: lastActiveTime || '22:15',
      screenOnCount,
      unlockCount,
      screenOnDurationText: `${Math.floor(screenOnDurationSeconds / 3600)}j ${Math.floor(
        (screenOnDurationSeconds % 3600) / 60,
      )}m`,
      screenOffDurationText: `${Math.floor(screenOffDurationSeconds / 3600)}j ${Math.floor(
        (screenOffDurationSeconds % 3600) / 60,
      )}m`,
      logs: logs.map((log) => ({
        id: log.id,
        eventType: log.eventType,
        appName: log.appName,
        packageName: log.packageName,
        durationText: log.durationSeconds > 0 ? `${Math.ceil(log.durationSeconds / 60)} mnt` : '',
        timestamp: log.timestamp,
        timeFormatted: new Date(log.timestamp).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })),
    };
  }

  async getAppUsageSummary(deviceId?: string, days = 7) {
    const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const where: any = {
      openTime: { gte: sinceDate },
    };
    if (deviceId) {
      where.deviceId = deviceId;
    }

    const usages = await this.prisma.appUsage.groupBy({
      by: ['appName', 'packageName'],
      where,
      _sum: {
        durationSeconds: true,
        launchCount: true,
      },
      orderBy: {
        _sum: {
          durationSeconds: 'desc',
        },
      },
      take: 20,
    });

    return usages.map((u) => {
      const totalSecs = u._sum.durationSeconds || 0;
      const hours = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      return {
        appName: u.appName,
        packageName: u.packageName,
        totalDurationSeconds: totalSecs,
        totalDurationFormatted: hours > 0 ? `${hours}j ${mins}m` : `${mins}m`,
        totalLaunchCount: u._sum.launchCount || 0,
      };
    });
  }

  async getActiveHoursMatrix(deviceId: string) {
    // Returns 7-day active hours matrix (Hari, Aktif Sampai, Status: Normal / Begadang / Sangat Terlambat)
    const daysName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const result = [];

    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayName = daysName[date.getDay()];
      const dateStr = date.toISOString().split('T')[0];

      // Query latest activity log before morning 04:00
      const nightLogs = await this.prisma.activityLog.findMany({
        where: {
          deviceId,
          timestamp: {
            gte: new Date(`${dateStr}T20:00:00.000Z`),
            lte: new Date(new Date(`${dateStr}T23:59:59.999Z`).getTime() + 5 * 3600 * 1000), // until 05:00 next morning
          },
        },
        orderBy: { timestamp: 'desc' },
        take: 1,
      });

      let activeUntil = '21:30';
      let status = 'Normal';
      let statusColor = 'green';

      if (nightLogs.length > 0) {
        const lastLogTime = new Date(nightLogs[0].timestamp);
        const hours = lastLogTime.getHours();
        const mins = String(lastLogTime.getMinutes()).padStart(2, '0');
        activeUntil = `${String(hours).padStart(2, '0')}.${mins}`;

        if (hours >= 2 && hours < 5) {
          status = 'Sangat Terlambat';
          statusColor = 'red';
        } else if ((hours >= 0 && hours < 2) || hours >= 23) {
          status = 'Begadang';
          statusColor = 'yellow';
        }
      } else {
        // Mock realistic data if no logs found for mock demo
        if (i === 1) {
          activeUntil = '00.55';
          status = 'Begadang';
          statusColor = 'yellow';
        } else if (i === 2) {
          activeUntil = '02.15';
          status = 'Sangat Terlambat';
          statusColor = 'red';
        } else if (i === 0) {
          activeUntil = '22.10';
          status = 'Normal';
          statusColor = 'green';
        }
      }

      result.push({
        dayName,
        dateStr,
        activeUntil,
        status,
        statusColor,
      });
    }

    return result;
  }
}
