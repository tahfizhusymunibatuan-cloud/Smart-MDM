import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Activity')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @ApiOperation({ summary: 'Timeline aktivitas interaktif perangkat (Screen ON, Buka App, Screen OFF)' })
  @Get('timeline/:deviceId')
  async getTimeline(@Param('deviceId') deviceId: string, @Query('date') date?: string) {
    const data = await this.activityService.getInteractiveTimeline(deviceId, date);
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Ringkasan penggunaan aplikasi (durasi total & frekuensi)' })
  @Get('app-usage')
  async getAppUsage(@Query('deviceId') deviceId?: string, @Query('days') days = 7) {
    const data = await this.activityService.getAppUsageSummary(deviceId, Number(days));
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Matriks jam aktif begadang 7 hari (Aktif sampai, status: Normal / Begadang / Terlambat)' })
  @Get('active-hours/:deviceId')
  async getActiveHours(@Param('deviceId') deviceId: string) {
    const data = await this.activityService.getActiveHoursMatrix(deviceId);
    return { success: true, data };
  }
}
