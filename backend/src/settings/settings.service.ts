import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.systemSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await this.prisma.systemSettings.create({
        data: {
          id: 'default',
          pondokName: 'Pondok Pesantren Tahfizh Quran Al-Usymuni',
          bedtimeStart: '22:00',
          bedtimeEnd: '04:00',
          studyStart: '08:00',
          studyEnd: '11:30',
          ngajiStart: '18:00',
          ngajiEnd: '20:00',
          syncThresholdMinutes: 15,
        },
      });
    }

    return settings;
  }

  async updateSettings(data: any, actorId?: string, actorName?: string) {
    const updated = await this.prisma.systemSettings.upsert({
      where: { id: 'default' },
      update: {
        pondokName: data.pondokName,
        bedtimeStart: data.bedtimeStart,
        bedtimeEnd: data.bedtimeEnd,
        studyStart: data.studyStart,
        studyEnd: data.studyEnd,
        ngajiStart: data.ngajiStart,
        ngajiEnd: data.ngajiEnd,
        syncThresholdMinutes: Number(data.syncThresholdMinutes) || 15,
      },
      create: {
        id: 'default',
        pondokName: data.pondokName || 'Pondok Pesantren Tahfizh Quran Al-Usymuni',
        bedtimeStart: data.bedtimeStart || '22:00',
        bedtimeEnd: data.bedtimeEnd || '04:00',
        studyStart: data.studyStart || '08:00',
        studyEnd: data.studyEnd || '11:30',
        ngajiStart: data.ngajiStart || '18:00',
        ngajiEnd: data.ngajiEnd || '20:00',
        syncThresholdMinutes: Number(data.syncThresholdMinutes) || 15,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        actorName: actorName || 'Super Admin',
        action: 'SETTINGS_UPDATED',
        target: 'System Settings Preset',
        metadata: data,
      },
    });

    return updated;
  }
}
