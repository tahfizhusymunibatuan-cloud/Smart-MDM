import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PoliciesService {
  constructor(private prisma: PrismaService) {}

  async getAllPolicies() {
    return this.prisma.policy.findMany({
      include: { restrictions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPolicyById(id: string) {
    const policy = await this.prisma.policy.findUnique({
      where: { id },
      include: { restrictions: true },
    });
    if (!policy) {
      throw new NotFoundException('Kebijakan tidak ditemukan');
    }
    return policy;
  }

  async createPolicy(data: any, actorId?: string, actorName?: string) {
    const policy = await this.prisma.policy.create({
      data: {
        title: data.title,
        policyType: data.policyType || 'CUSTOM',
        startTime: data.startTime,
        endTime: data.endTime,
        targetType: data.targetType || 'ALL',
        targetGroups: data.targetGroups || [],
        targetUserIds: data.targetUserIds || [],
        isEnabled: data.isEnabled !== undefined ? data.isEnabled : true,
        restrictions: {
          create: (data.restrictions || []).map((r: any) => ({
            appName: r.appName,
            packageName: r.packageName,
          })),
        },
      },
      include: { restrictions: true },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        actorName: actorName || 'Super Admin',
        action: 'POLICY_CREATED',
        target: `Policy: ${policy.title}`,
        metadata: { startTime: policy.startTime, endTime: policy.endTime },
      },
    });

    return policy;
  }

  async updatePolicy(id: string, data: any, actorId?: string, actorName?: string) {
    // Delete existing restrictions first if provided
    if (data.restrictions) {
      await this.prisma.policyAppRestriction.deleteMany({
        where: { policyId: id },
      });
    }

    const updated = await this.prisma.policy.update({
      where: { id },
      data: {
        title: data.title,
        policyType: data.policyType,
        startTime: data.startTime,
        endTime: data.endTime,
        targetType: data.targetType,
        targetGroups: data.targetGroups,
        targetUserIds: data.targetUserIds,
        isEnabled: data.isEnabled,
        restrictions: data.restrictions
          ? {
              create: data.restrictions.map((r: any) => ({
                appName: r.appName,
                packageName: r.packageName,
              })),
            }
          : undefined,
      },
      include: { restrictions: true },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        actorName: actorName || 'Super Admin',
        action: 'POLICY_UPDATED',
        target: `Policy: ${updated.title}`,
        metadata: { isEnabled: updated.isEnabled },
      },
    });

    return updated;
  }

  async deletePolicy(id: string, actorId?: string, actorName?: string) {
    const policy = await this.prisma.policy.findUnique({ where: { id } });
    if (!policy) throw new NotFoundException('Kebijakan tidak ditemukan');

    await this.prisma.policy.delete({ where: { id } });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        actorName: actorName || 'Super Admin',
        action: 'POLICY_DELETED',
        target: `Policy: ${policy.title}`,
      },
    });

    return { message: 'Kebijakan berhasil dihapus' };
  }
}
