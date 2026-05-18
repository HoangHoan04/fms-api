import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ContributionEntity } from './contribution.entity';
import { MemberEntity } from '../users/member.entity';

@Entity('contribution-reminders')
export class ContributionReminderEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  contributionId: string;
  @ManyToOne(() => ContributionEntity, (c) => c.reminders)
  @JoinColumn({ name: 'contributionId' })
  contribution: ContributionEntity;

  @Column({ type: 'uuid' })
  memberId: string;
  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: 'memberId' })
  member: MemberEntity;

  @Column({ type: 'varchar', length: 20 })
  channel: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'boolean', default: true })
  isAuto: boolean;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'timestamptz', nullable: true })
  sentAt?: Date;

  @Column({ type: 'text', nullable: true })
  failReason?: string;
}
