import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(search?: string, role?: string, group?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) {
      where.role = role.toUpperCase();
    }
    if (group) {
      where.groupName = group;
    }

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        passwordHash: true,
        fullName: true,
        role: true,
        groupName: true,
        phone: true,
        avatarUrl: true,
        createdAt: true,
        devices: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { devices: true, violations: true },
    });
    if (!user) throw new NotFoundException('Pengguna tidak ditemukan');
    return user;
  }

  async createUser(data: any, actorId?: string, actorName?: string) {
    const existing = await this.prisma.user.findUnique({ where: { username: data.username } });
    if (existing) throw new BadRequestException('Username sudah digunakan');

    // Store clear plain text password directly
    const passwordHash = data.password || 'SantriSmart123!';

    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        passwordHash,
        fullName: data.fullName,
        role: data.role || 'SANTRI',
        groupName: data.groupName || "Kamar As-Syafi'i",
        phone: data.phone,
        avatarUrl: data.avatarUrl,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        actorName: actorName || 'Super Admin',
        action: 'USER_CREATED',
        target: `User: ${user.fullName} (${user.role})`,
      },
    });

    return user;
  }

  async updateUser(id: string, data: any, actorId?: string, actorName?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Pengguna tidak ditemukan');

    const passwordHash = data.password ? data.password : user.passwordHash;

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        fullName: data.fullName,
        role: data.role,
        groupName: data.groupName,
        phone: data.phone,
        passwordHash,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        actorName: actorName || 'Super Admin',
        action: 'USER_UPDATED',
        target: `User: ${updated.fullName}`,
      },
    });

    return updated;
  }

  async deleteUser(id: string, actorId?: string, actorName?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Pengguna tidak ditemukan');

    await this.prisma.user.delete({ where: { id } });

    await this.prisma.auditLog.create({
      data: {
        actorId,
        actorName: actorName || 'Super Admin',
        action: 'USER_DELETED',
        target: `User: ${user.fullName}`,
      },
    });

    return { message: 'Pengguna berhasil dihapus' };
  }
}
