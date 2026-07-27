import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private auditLogsService: AuditLogsService) {}

  @ApiOperation({ summary: 'Ambil audit log dengan pencarian (user, device, tanggal, jenis aktivitas)' })
  @Get()
  async getAuditLogs(
    @Query('search') search?: string,
    @Query('user') user?: string,
    @Query('device') device?: string,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    const data = await this.auditLogsService.getAuditLogs({
      search,
      user,
      device,
      action,
      startDate,
      endDate,
      page: Number(page),
      limit: Number(limit),
    });
    return { success: true, ...data };
  }
}
