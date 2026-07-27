import { Controller, Get, Put, Body, Request, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('System Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @ApiOperation({ summary: 'Ambil konfigurasi preset sistem pondok' })
  @Get()
  async getSettings() {
    const data = await this.settingsService.getSettings();
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Perbarui konfigurasi preset sistem (Nama Pondok, Jam Tidur/Belajar/Mengaji, Sync threshold)' })
  @Put()
  async updateSettings(@Request() req: any, @Body() body: any) {
    const data = await this.settingsService.updateSettings(body, req.user.id, req.user.fullName);
    return { success: true, data };
  }
}
