import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ContributionEntity } from './contribution.entity';

/** Nhắc nhở đóng tiền cho từng thành viên trong chu kỳ */
@Entity('contribution-reminders')
export class ContributionReminderEntity extends BaseEntity {
  /** Khoản đóng tiền cần nhắc */
  @Column({ type: 'uuid' })
  contributionId: string;
  @ManyToOne(() => ContributionEntity, (c) => c.reminders)
  @JoinColumn({ name: 'contributionId' })
  contribution: ContributionEntity;

  /** Thời điểm gửi nhắc nhở */
  @Column({ type: 'timestamptz', nullable: true })
  reminderDate?: Date;

  /** Kênh gửi: email | sms | push   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  channel?: string;

  /** Trạng thái: pending | sent | failed */
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  /** Thời điểm đã gửi thực tế */
  @Column({ type: 'timestamptz', nullable: true })
  sentAt?: Date;

  /** Lý do thất bại nếu status = failed */
  @Column({ type: 'text', nullable: true })
  failReason?: string;
}
