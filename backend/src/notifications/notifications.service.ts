import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private gateway: NotificationsGateway,
  ) {}

  async getUnreadNotifications() {
    return this.prisma.notification.findMany({
      where: { isRead: false },
      include: { device: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async getAllNotifications(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        include: { device: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count(),
    ]);
    return { data, total, page, limit };
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead() {
    return this.prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
  }

  async createNotification(title: string, message: string, type = 'INFO', deviceId?: string) {
    const notif = await this.prisma.notification.create({
      data: {
        title,
        message,
        type,
        deviceId,
      },
      include: { device: true },
    });

    this.gateway.emitNotification(notif);
    return notif;
  }
}
