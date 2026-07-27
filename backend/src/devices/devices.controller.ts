import { Controller, Get, Post, Put, Body, Param, Query, Res, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { MdmProfileService } from './mdm-profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Devices')
@ApiBearerAuth()
@Controller('devices')
export class DevicesController {
  constructor(
    private devicesService: DevicesService,
    private mdmProfileService: MdmProfileService,
  ) {}

  @ApiOperation({ summary: 'Ringkasan metrik dashboard perangkat realtime' })
  @Get('dashboard-summary')
  async getDashboardSummary() {
    const data = await this.devicesService.getDashboardSummary();
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Daftar semua perangkat dengan filter (search, OS, status, health)' })
  @Get()
  async getAllDevices(
    @Query('search') search?: string,
    @Query('os') os?: string,
    @Query('status') status?: string,
    @Query('health') health?: string,
  ) {
    const data = await this.devicesService.getAllDevices({ search, os, status, health });
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Detail perangkat berdasarkan ID' })
  @Get(':id')
  async getDeviceById(@Param('id') id: string) {
    const data = await this.devicesService.getDeviceById(id);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Pendaftaran perangkat baru' })
  @Post('register')
  async registerDevice(@Body() body: any) {
    const data = await this.devicesService.registerDevice(body);
    return { success: true, data };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Pembaruan telemetri perangkat (baterai, status online, jaringan)' })
  @Put(':id/telemetry')
  async updateTelemetry(@Param('id') id: string, @Body() body: any) {
    const data = await this.devicesService.updateTelemetry(id, body);
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Auto-enroll wireless tanpa USB untuk APK Android & iOS Agent' })
  @Post('auto-enroll')
  async autoEnroll(@Body() body: any) {
    const data = await this.devicesService.autoEnrollDevice(body);
    return data;
  }

  @ApiOperation({ summary: 'Public Telemetry Sync dari APK tanpa login admin' })
  @Put(':id/public-telemetry')
  async publicTelemetry(@Param('id') id: string, @Body() body: any) {
    const data = await this.devicesService.updateTelemetry(id, body);
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Unduh profil Apple MDM Supervised (.mobileconfig) untuk iOS santri' })
  @Get(':id/apple-mdm-profile')
  async getAppleMdmProfile(@Param('id') id: string, @Res() res: any) {
    const device = await this.devicesService.getDeviceById(id);
    const xmlProfile = this.mdmProfileService.generateAppleMdmProfile(device.id, device.deviceName);
    
    res.setHeader('Content-Type', 'application/x-apple-asn1-signed-data');
    res.setHeader('Content-Disposition', `attachment; filename="smart-mdm-${device.deviceName.replace(/\s+/g, '_')}.mobileconfig"`);
    return res.send(xmlProfile);
  }
}
