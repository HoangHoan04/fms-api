import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { NotificationEntity } from './notification.entity';

/** Mẫu thông báo dùng để tái sử dụng nội dung theo sự kiện */
@Entity('notification-templates')
export class NotificationTemplateEntity extends BaseEntity {
  /** Mã mẫu, VD: CONTRIBUTION_REMINDER | RECEIPT_APPROVED */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  /** Tiêu đề mẫu thông báo (có thể chứa biến {{name}}) */
  @Column({ type: 'varchar', length: 255 })
  title: string;

  /** Nội dung mẫu (hỗ trợ biến động {{amount}}, {{cycle}}, ...) */
  @Column({ type: 'text', nullable: true })
  body?: string;

  /** Kênh gửi mặc định: email | sms | push | all */
  @Column({ type: 'varchar', length: 50, nullable: true })
  channel?: string;

  /** Loại sự kiện kích hoạt mẫu này */
  @Column({ type: 'varchar', length: 100, nullable: true })
  eventType?: string;

  // Relations
  @OneToMany(() => NotificationEntity, (n) => n.template)
  notifications: NotificationEntity[];
}
