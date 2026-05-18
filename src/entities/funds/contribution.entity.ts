import { transformer } from '@/helpers';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FileArchivalEntity } from '../file-archival.entity';
import { MemberEntity } from '../users/member.entity';
import { UserEntity } from '../users/user.entity';
import { CycleEntity } from './cycle.entity';
import { ContributionReminderEntity } from './contribution-reminder.entity';

@Entity('contributions')
export class ContributionEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  cycleId: string;
  @ManyToOne(() => CycleEntity, (c) => c.contributions)
  @JoinColumn({ name: 'cycleId' })
  cycle: CycleEntity;

  @Column({ type: 'uuid' })
  memberId: string;
  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: 'memberId' })
  member: MemberEntity;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    transformer: transformer,
  })
  requiredAmount: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
    transformer: transformer,
  })
  paidAmount: number;

  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  paidAt?: Date;

  @Column({ type: 'varchar', length: 30, nullable: true })
  paymentMethod?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionRef?: string;

  @Column({ type: 'uuid', nullable: true })
  proofFileId?: string;
  @ManyToOne(() => FileArchivalEntity)
  @JoinColumn({ name: 'proofFileId' })
  proofFile?: FileArchivalEntity;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'boolean', default: false })
  isLate: boolean;

  @Column({ type: 'int', default: 0 })
  lateDays: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
    transformer: transformer,
  })
  lateFee: number;

  @Column({ type: 'uuid', nullable: true })
  confirmedBy?: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'confirmedBy' })
  confirmer?: UserEntity;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @OneToMany(() => ContributionReminderEntity, (cr) => cr.contribution)
  reminders: ContributionReminderEntity[];
}
