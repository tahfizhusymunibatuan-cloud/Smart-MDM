import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { MdmProfileService } from './mdm-profile.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [DevicesController],
  providers: [DevicesService, MdmProfileService],
  exports: [DevicesService, MdmProfileService],
})
export class DevicesModule {}
