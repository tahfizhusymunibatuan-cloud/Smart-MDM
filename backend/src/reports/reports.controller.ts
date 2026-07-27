import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @ApiOperation({ summary: 'Ambil data laporan interaktif berbasis web (Harian, Mingguan, Bulanan)' })
  @Get('web')
  async getWebReport(
    @Query('period') period: 'daily' | 'weekly' | 'monthly' = 'daily',
    @Query('date') date?: string,
  ) {
    const data = await this.reportsService.generateWebReport(period, date);
    return { success: true, data };
  }
}
