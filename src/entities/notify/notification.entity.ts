import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { NotificationTemplateEntity } from './notification-template.entity';
import { UserEntity } from '../users/user.entity';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @ApiProperty({ description: 'ID mẫu thông báo (null nếu tạo thủ công)' })
  @Column({ type: 'uuid', nullable: true })
  templateId?: string;
  @ManyToOne(() => NotificationTemplateEntity, (nt) => nt.notifications)
  @JoinColumn({ name: 'templateId' })
  template?: NotificationTemplateEntity;

  @ApiProperty({ description: 'Loại nhận: personal | group_broadcast' })
  @Column({ type: 'varchar', length: 20, default: 'personal' })
  recipientType: string;

  @ApiProperty({ description: 'ID người nhận (null nếu group_broadcast)' })
  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @ApiProperty({ description: 'Tiêu đề sau khi đã thay biến' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ description: 'Nội dung sau khi đã thay biến' })
  @Column({ type: 'text', nullable: true })
  body?: string;

  @ApiProperty({ description: 'Dữ liệu bổ sung' })
  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, any>;

  @ApiProperty({ description: 'Kênh gửi: email | zalo | sms | in_app' })
  @Column({ type: 'varchar', length: 20 })
  channel: string;

  @ApiProperty({ description: 'Đã đọc chưa' })
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @ApiProperty({ description: 'Thời điểm đọc' })
  @Column({ type: 'timestamptz', nullable: true })
  readAt?: Date;

  @ApiProperty({
    description: 'Trạng thái: pending | processing | sent | failed',
  })
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @ApiProperty({ description: 'Thời điểm gửi thành công' })
  @Column({ type: 'timestamptz', nullable: true })
  sentAt?: Date;

  @ApiProperty({ description: 'Lý do thất bại nếu có' })
  @Column({ type: 'text', nullable: true })
  failReason?: string;

  @ApiProperty({
    description:
      'Loại đối tượng liên quan: Member | Cycle | Contribution | Disbursement',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  relatedEntityType?: string;

  @ApiProperty({ description: 'ID đối tượng liên quan' })
  @Column({ type: 'uuid', nullable: true })
  relatedEntityId?: string;
}
