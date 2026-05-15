import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserEntity } from '../users/user.entity';
import { NotificationTemplateEntity } from './notification-template.entity';

/** Bản ghi thông báo thực tế gửi đến người dùng */
@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  /** Người nhận thông báo */
  @Column({ type: 'uuid' })
  userId: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  /** Mẫu thông báo đã dùng (null nếu tạo thủ công) */
  @Column({ type: 'uuid', nullable: true })
  templateId?: string;
  @ManyToOne(() => NotificationTemplateEntity, (nt) => nt.notifications)
  @JoinColumn({ name: 'templateId' })
  template?: NotificationTemplateEntity;

  /** Tiêu đề sau khi đã thay biến */
  @Column({ type: 'varchar', length: 255 })
  title: string;

  /** Nội dung sau khi đã thay biến */
  @Column({ type: 'text', nullable: true })
  body?: string;

  /** Dữ liệu bổ sung: {"receiptId": "...", "cycleId": "..."} */
  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, any>;

  /** Kênh đã gửi: email | sms | push */
  @Column({ type: 'varchar', length: 50, nullable: true })
  channel?: string;

  /** Người dùng đã đọc chưa */
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  /** Thời điểm đọc */
  @Column({ type: 'timestamptz', nullable: true })
  readAt?: Date;

  /** Thời điểm gửi thực tế */
  @Column({ type: 'timestamptz', nullable: true })
  sentAt?: Date;

  /** Lý do thất bại nếu gửi không thành công */
  @Column({ type: 'text', nullable: true })
  failReason?: string;

  /** Loại đối tượng liên quan: FundReceipt | Contribution | FundCycle */
  @Column({ type: 'varchar', length: 50, nullable: true })
  relatedEntityType?: string;

  /** UUID của đối tượng liên quan (để deep-link) */
  @Column({ type: 'uuid', nullable: true })
  relatedEntityId?: string;
}
