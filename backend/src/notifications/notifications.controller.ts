import { Controller, Get, Put, Param, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notifService: NotificationsService) {}

  @ApiOperation({ summary: 'Ambil daftar notifikasi (paginated)' })
  @Get()
  async getNotifications(@Query('page') page = 1, @Query('limit') limit = 50) {
    const data = await this.notifService.getAllNotifications(Number(page), Number(limit));
    return { success: true, ...data };
  }

  @ApiOperation({ summary: 'Ambil notifikasi belum dibaca' })
  @Get('unread')
  async getUnread() {
    const data = await this.notifService.getUnreadNotifications();
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Tandai notifikasi sebagai dibaca' })
  @Put(':id/read')
  async markRead(@Param('id') id: string) {
    const data = await this.notifService.markAsRead(id);
    return { success: true, data };
  }

  @ApiOperation({ summary: 'Tandai semua notifikasi sebagai dibaca' })
  @Put('read-all')
  async markAllRead() {
    const data = await this.notifService.markAllAsRead();
    return { success: true, data };
  }
}
