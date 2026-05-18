import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { transformer } from '../../helpers';
import { BaseEntity } from '../base.entity';
import { FileArchivalEntity } from '../file-archival.entity';
import { UserEntity } from '../users/user.entity';
import { MemberEntity } from '../users/member.entity';
import { CycleEntity } from './cycle.entity';
import { CycleRegistrationEntity } from './cycle-registration.entity';
import { DisbursementConfirmationEntity } from './disbursement-confirmation.entity';

@Entity('disbursements')
export class DisbursementEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  cycleId: string;
  @ManyToOne(() => CycleEntity, (c) => c.disbursements)
  @JoinColumn({ name: 'cycleId' })
  cycle: CycleEntity;

  @Column({ type: 'uuid', nullable: true })
  registrationId?: string;
  @ManyToOne(() => CycleRegistrationEntity)
  @JoinColumn({ name: 'registrationId' })
  registration?: CycleRegistrationEntity;

  @Column({ type: 'uuid' })
  receiverId: string;
  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: 'receiverId' })
  receiver: MemberEntity;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    transformer: transformer,
  })
  amount: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  paymentMethod?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionRef?: string;

  @Column({ type: 'uuid', nullable: true })
  proofFileId?: string;
  @ManyToOne(() => FileArchivalEntity)
  @JoinColumn({ name: 'proofFileId' })
  proofFile?: FileArchivalEntity;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bankName?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bankAccountNo?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bankAccountName?: string;

  @Column({ type: 'uuid', nullable: true })
  disbursedBy?: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'disbursedBy' })
  disburser?: UserEntity;

  @Column({ type: 'timestamptz', nullable: true })
  disbursedAt?: Date;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @OneToMany(() => DisbursementConfirmationEntity, (dc) => dc.disbursement)
  confirmations: DisbursementConfirmationEntity[];
}
