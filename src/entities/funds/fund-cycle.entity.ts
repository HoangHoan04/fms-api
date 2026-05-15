import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FundEntity } from './fund.entity';
import { ContributionEntity } from './contribution.entity';
import { FundReceiptEntity } from './fund-receipt.entity';
import { DisbursementEntity } from './disbursement.entity';
import { FundCycleSummaryEntity } from './fund-cycle-summary.entity';

/** Chu kỳ đóng quỹ – mỗi bản ghi đại diện cho một kỳ thu */
@Entity('fund-cycles')
export class FundCycleEntity extends BaseEntity {
  /** Quỹ mà chu kỳ này thuộc về */
  @Column({ type: 'uuid' })
  fundId: string;
  @ManyToOne(() => FundEntity, (f) => f.fundCycles)
  @JoinColumn({ name: 'fundId' })
  fund: FundEntity;

  /** Mã chu kỳ, VD: CYCLE-2024-01 */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  /** Số thứ tự chu kỳ (kỳ 1, kỳ 2, ...) */
  @Column({ type: 'int' })
  cycleIndex: number;

  /** Tên chu kỳ hiển thị, VD: "Kỳ tháng 1/2024" */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /** Ngày bắt đầu thu tiền kỳ này */
  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  /** Hạn chót đóng tiền kỳ này */
  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  /** Ngày giải ngân – ngày chuyển tiền cho người nhận */
  @Column({ type: 'date', nullable: true })
  payoutDate?: Date;

  /** Số tiền mỗi thành viên cần đóng kỳ này */
  @Column({ type: 'decimal', precision: 18, scale: 2 })
  contributionAmount: number;

  /** Tổng tiền dự kiến thu được */
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  totalExpected?: number;

  /** Tổng tiền đã thu được thực tế */
  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalCollected: number;

  /** Tổng tiền đã giải ngân cho người nhận */
  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalPaidOut: number;

  /** Trạng thái: open | collecting | closed | paid_out | cancelled */
  @Column({ type: 'varchar', length: 20, default: 'open' })
  status: string;

  /** Ghi chú nội bộ về chu kỳ này */
  @Column({ type: 'text', nullable: true })
  note?: string;

  // Relations
  @OneToMany(() => ContributionEntity, (c) => c.cycle)
  contributions: ContributionEntity[];

  @OneToMany(() => FundReceiptEntity, (fr) => fr.cycle)
  fundReceipts: FundReceiptEntity[];

  @OneToMany(() => DisbursementEntity, (d) => d.cycle)
  disbursements: DisbursementEntity[];

  @OneToMany(() => FundCycleSummaryEntity, (fcs) => fcs.cycle)
  summaries: FundCycleSummaryEntity[];
}
