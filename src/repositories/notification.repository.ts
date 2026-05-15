import {
  NotificationEntity,
  NotificationTemplateEntity,
} from '@/entities/notify';
import { CustomRepository } from '@/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(NotificationTemplateEntity)
export class NotificationTemplateRepository extends Repository<NotificationTemplateEntity> {}

@CustomRepository(NotificationEntity)
export class NotificationRepository extends Repository<NotificationEntity> {}
