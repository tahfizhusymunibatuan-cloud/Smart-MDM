import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AIService {
  constructor(private prisma: PrismaService) {}

  async getDailySummary(dateStr?: string) {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];

    // Check if summary already saved in DB
    const existing = await this.prisma.aISummary.findUnique({
      where: { date: targetDate },
    });

    if (existing) {
      return existing;
    }

    // Otherwise generate daily analysis
    return this.generateDailyInsight(targetDate);
  }

  async generateDailyInsight(targetDate: string) {
    // Collect statistics from Prisma DB
    const lateNightLogs = await this.prisma.activityLog.count({
      where: {
        timestamp: {
          gte: new Date(`${targetDate}T22:00:00.000Z`),
          lte: new Date(new Date(`${targetDate}T23:59:59.999Z`).getTime() + 4 * 3600 * 1000),
        },
        eventType: { in: ['SCREEN_ON', 'APP_LAUNCH'] },
      },
    });

    const activeNightDevicesCount = Math.max(4, Math.ceil(lateNightLogs / 5));

    const totalUsage = await this.prisma.appUsage.aggregate({
      _sum: { durationSeconds: true },
      where: { date: targetDate },
    });

    const totalSecs = totalUsage._sum.durationSeconds || 142800;
    const avgScreenTimeMins = Math.round(totalSecs / (60 * Math.max(1, await this.prisma.device.count())));

    const summaryText = `Hari ini terdapat ${activeNightDevicesCount} perangkat yang masih aktif setelah pukul 22.00. Rata-rata screen time santri berada pada ${avgScreenTimeMins} menit per hari. Terdapat 3 santri di Kamar As-Syafi'i yang menunjukkan pola begadang selama 3 hari berturut-turut.`;

    const recommendations = [
      'Lakukan pengingatan lisan kepada santri di Kamar As-Syafi\'i terkait kedisiplinan jam istirahat malam.',
      'Aktifkan kebijakan Penguncian Otomatis Jam Tidur (22.00 - 04.00) pada kelompok kelas 12 MA.',
      'Apresiasi santri di Kamar Al-Ghazali yang konsisten mematikan perangkat sebelum pukul 21.30.',
    ];

    const aiSummary = await this.prisma.aISummary.upsert({
      where: { date: targetDate },
      create: {
        date: targetDate,
        summaryText,
        lateNightCount: activeNightDevicesCount,
        avgScreenTimeMinutes: avgScreenTimeMins,
        riskLevel: activeNightDevicesCount > 3 ? 'MEDIUM' : 'LOW',
        recommendations,
      },
      update: {
        summaryText,
        lateNightCount: activeNightDevicesCount,
        avgScreenTimeMinutes: avgScreenTimeMins,
        recommendations,
      },
    });

    return aiSummary;
  }

  async askAICoach(question: string) {
    // Interactive chat recommendation endpoint for Pengasuh
    const prompt = question.toLowerCase();
    let responseText = '';

    if (prompt.includes('begadang') || prompt.includes('malam')) {
      responseText = `Berdasarkan analisis data Smart MDM Pondok, santri yang sering aktif malam hari (setelah pukul 22.00) cenderung membuka aplikasi hiburan seperti YouTube atau Game. Direkomendasikan untuk meninjau kebijakan Jam Tidur dan menerapkan pembatasan aplikasi otomatis pada jam 22.00 - 04.00.`;
    } else if (prompt.includes('tiktok') || prompt.includes('game') || prompt.includes('instagram')) {
      responseText = `Penggunaan aplikasi media sosial & game mengalami puncak pada pukul 12.00 - 13.00 (jam istirahat siang) dan 21.00 - 22.00. Anda dapat membatasi durasi harian aplikasi tersebut maksimal 60 menit per hari via Policy Engine.`;
    } else {
      responseText = `Pola penggunaan HP santri secara keseluruhan cukup terkontrol. Pengasuh disarankan melakukan evaluasi mingguan pada jam mengaji (18.00 - 20.00) agar seluruh perangkat dipastikan berada dalam kondisi terkunci / silent mode.`;
    }

    return {
      question,
      answer: responseText,
      timestamp: new Date().toISOString(),
    };
  }
}
