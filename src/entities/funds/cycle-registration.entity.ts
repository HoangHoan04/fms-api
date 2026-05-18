import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { CycleEntity } from './cycle.entity';
import { MemberEntity } from '../users/member.entity';
import { FileArchivalEntity } from '../file-archival.entity';
import { UserEntity } from '../users/user.entity';
import { RegistrationStatusLogEntity } from './registration-status-log.entity';

@Entity('cycle-registrations')
export class CycleRegistrationEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  cycleId: string;
  @ManyToOne(() => CycleEntity, (c) => c.registrations)
  @JoinColumn({ name: 'cycleId' })
  cycle: CycleEntity;

  @Column({ type: 'uuid' })
  memberId: string;
  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: 'memberId' })
  member: MemberEntity;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bankName?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bankAccountNo?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bankAccountName?: string;

  @Column({ type: 'uuid', nullable: true })
  qrCodeFileId?: string;
  @ManyToOne(() => FileArchivalEntity)
  @JoinColumn({ name: 'qrCodeFileId' })
  qrCodeFile?: FileArchivalEntity;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'boolean', default: false })
  isFirstTime: boolean;

  @Column({ type: 'int', default: 0 })
  totalReceivedBefore: number;

  @Column({ type: 'uuid', nullable: true })
  reviewedBy?: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'reviewedBy' })
  reviewer?: UserEntity;

  @Column({ type: 'timestamptz', nullable: true })
  reviewedAt?: Date;

  @Column({ type: 'text', nullable: true })
  reviewNote?: string;

  @OneToMany(() => RegistrationStatusLogEntity, (rsl) => rsl.registration)
  statusLogs: RegistrationStatusLogEntity[];
}
