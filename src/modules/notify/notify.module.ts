import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@/typeorm';
import {
  NotificationRepository,
  NotificationTemplateRepository,
  UserRepository,
} from '@/repositories';
import { NotifyController } from './controllers/notify-admin.controller';
import { NotifyService } from './notify.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      NotificationRepository,
      NotificationTemplateRepository,
      UserRepository,
    ]),
  ],
  providers: [NotifyService],
  exports: [NotifyService],
  controllers: [NotifyController],
})
export class NotifyModule {}
