import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async getAuditLogs(query?: {
    search?: string;
    user?: string;
    device?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query?.search) {
      where.OR = [
        { actorName: { contains: query.search, mode: 'insensitive' } },
        { action: { contains: query.search, mode: 'insensitive' } },
        { target: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query?.user) {
      where.actorName = { contains: query.user, mode: 'insensitive' };
    }

    if (query?.action) {
      where.action = query.action;
    }

    if (query?.startDate || query?.endDate) {
      where.timestamp = {};
      if (query?.startDate) {
        where.timestamp.gte = new Date(query.startDate);
      }
      if (query?.endDate) {
        where.timestamp.lte = new Date(query.endDate);
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, total, page, limit };
  }
}
