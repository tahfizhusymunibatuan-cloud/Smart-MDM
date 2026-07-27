import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { ActivityModule } from './activity/activity.module';
import { PoliciesModule } from './policies/policies.module';
import { ComplianceModule } from './compliance/compliance.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { AIModule } from './ai/ai.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { SettingsModule } from './settings/settings.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    DevicesModule,
    ActivityModule,
    PoliciesModule,
    ComplianceModule,
    NotificationsModule,
    ReportsModule,
    AIModule,
    AuditLogsModule,
    SettingsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
