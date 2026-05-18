import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { transformer } from '../../helpers';
import { BaseEntity } from '../base.entity';
import { CycleEntity } from './cycle.entity';
import { UserEntity } from '../users/user.entity';

@Entity('fund-transactions')
export class FundTransactionEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  cycleId: string;
  @ManyToOne(() => CycleEntity)
  @JoinColumn({ name: 'cycleId' })
  cycle: CycleEntity;

  @Column({ type: 'varchar', length: 30 })
  transactionType: string;

  @Column({ type: 'varchar', length: 10 })
  direction: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    transformer: transformer,
  })
  amount: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
    transformer: transformer,
  })
  balanceBefore?: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
    transformer: transformer,
  })
  balanceAfter?: number;

  @Column({ type: 'uuid', nullable: true })
  relatedId?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  relatedType?: string;

  @Column({ type: 'date', nullable: true })
  transactionDate?: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  performedBy?: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'performedBy' })
  performer?: UserEntity;
}
