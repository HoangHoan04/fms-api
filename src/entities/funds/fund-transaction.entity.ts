import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FundEntity } from './fund.entity';
import { FundCycleEntity } from './fund-cycle.entity';
import { UserEntity } from '../users/user.entity';

/** Sổ thu chi – ghi nhận mọi dòng tiền vào/ra của quỹ */
@Entity('fund-transactions')
export class FundTransactionEntity extends BaseEntity {
  /** Quỹ liên quan */
  @Column({ type: 'uuid' })
  fundId: string;
  @ManyToOne(() => FundEntity, (f) => f.fundTransactions)
  @JoinColumn({ name: 'fundId' })
  fund: FundEntity;

  /** Chu kỳ liên quan (null nếu giao dịch ngoài kỳ) */
  @Column({ type: 'uuid', nullable: true })
  cycleId?: string;
  @ManyToOne(() => FundCycleEntity)
  @JoinColumn({ name: 'cycleId' })
  cycle?: FundCycleEntity;

  /** Loại: contribution | disbursement | fee | adjustment | refund */
  @Column({ type: 'varchar', length: 50 })
  transactionType: string;

  /** Chiều: in (thu vào) | out (chi ra) */
  @Column({ type: 'varchar', length: 10 })
  direction: string;

  /** Số tiền giao dịch */
  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  /** Số dư trước giao dịch */
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  balanceBefore?: number;

  /** Số dư sau giao dịch */
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  balanceAfter?: number;

  /** UUID tham chiếu (Contribution.id hoặc Disbursement.id) */
  @Column({ type: 'uuid', nullable: true })
  relatedId?: string;

  /** Loại đối tượng tham chiếu */
  @Column({ type: 'varchar', length: 50, nullable: true })
  relatedType?: string;

  /** Ngày giao dịch */
  @Column({ type: 'date', nullable: true })
  transactionDate?: Date;

  /** Mô tả giao dịch */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /** Người thực hiện / xác nhận giao dịch */
  @Column({ type: 'uuid', nullable: true })
  performedBy?: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'performedBy' })
  performer?: UserEntity;
}
