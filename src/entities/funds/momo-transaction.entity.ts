import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { transformer } from '../../helpers';
import { BaseEntity } from '../base.entity';
import { ContributionEntity } from './contribution.entity';
import { DisbursementEntity } from './disbursement.entity';

@Entity('momo-transactions')
export class MomoTransactionEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  contributionId?: string;
  @ManyToOne(() => ContributionEntity)
  @JoinColumn({ name: 'contributionId' })
  contribution?: ContributionEntity;

  @Column({ type: 'uuid', nullable: true })
  disbursementId?: string;
  @ManyToOne(() => DisbursementEntity)
  @JoinColumn({ name: 'disbursementId' })
  disbursement?: DisbursementEntity;

  @Column({ type: 'varchar', length: 255, unique: true })
  momoOrderId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  momoRequestId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  momoTransId?: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    transformer: transformer,
  })
  amount: number;

  @Column({ type: 'varchar', length: 10 })
  direction: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  payType?: string;

  @Column({ type: 'timestamptz', nullable: true })
  requestedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'int', nullable: true })
  resultCode?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resultMessage?: string;

  @Column({ type: 'text', nullable: true })
  rawResponse?: string;

  @Column({ type: 'timestamptz', nullable: true })
  ipnReceivedAt?: Date;
}
