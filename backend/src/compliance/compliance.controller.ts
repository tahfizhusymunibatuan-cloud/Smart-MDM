import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('compliance')
export class ComplianceController {
  constructor(private complianceService: ComplianceService) {}

  @ApiOperation({ summary: 'Ringkasan status kepatuhan perangkat (Hijau, Kuning, Merah)' })
  @Get('summary')
  async getSummary() {
    const data = await this.complianceService.getComplianceSummary();
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Jalankan audit kepatuhan perangkat instan' })
  @Post('check')
  async runCheck() {
    const data = await this.complianceService.runComplianceCheck();
    return { success: true, data };
  }
}
