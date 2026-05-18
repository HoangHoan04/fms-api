import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { NotificationEntity } from './notification.entity';

@Entity('notification-templates')
export class NotificationTemplateEntity extends BaseEntity {
  @ApiProperty({
    description:
      'Mã mẫu: UPCOMING_BIRTHDAY, BIRTHDAY_CONGRATS, CONTRIBUTION_OPENED, ...',
  })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  @ApiProperty({ description: 'Tên hiển thị gợi nhớ' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Tiêu đề mẫu (có placeholders)' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ description: 'Nội dung mẫu (có placeholders)' })
  @Column({ type: 'text', nullable: true })
  body?: string;

  @ApiProperty({
    description:
      'Kênh gửi mặc định: email | zalo | sms | in_app | broadcast_group',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  channel?: string;

  @ApiProperty({ description: 'Loại sự kiện kích hoạt mẫu này' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  eventType?: string;

  @ApiProperty({ description: 'Bật/tắt mẫu thông báo này' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => NotificationEntity, (n) => n.template)
  notifications: NotificationEntity[];
}
