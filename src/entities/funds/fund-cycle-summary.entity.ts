import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FundCycleEntity } from './fund-cycle.entity';

/** Snapshot tổng kết tài chính của quỹ sau mỗi chu kỳ */
@Entity('fund-cycle-summaries')
export class FundCycleSummaryEntity extends BaseEntity {
  /** Chu kỳ được tổng kết */
  @Column({ type: 'uuid' })
  cycleId: string;
  @ManyToOne(() => FundCycleEntity, (fc) => fc.summaries)
  @JoinColumn({ name: 'cycleId' })
  cycle: FundCycleEntity;

  /** Tổng số thành viên active trong kỳ */
  @Column({ type: 'int', nullable: true })
  totalMembers?: number;

  /** Số thành viên đã đóng tiền */
  @Column({ type: 'int', nullable: true })
  totalPaid?: number;

  /** Số thành viên chưa đóng tiền */
  @Column({ type: 'int', nullable: true })
  totalUnpaid?: number;

  /** Số thành viên đóng trễ */
  @Column({ type: 'int', nullable: true })
  totalLate?: number;

  /** Tổng tiền kỳ vọng thu */
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  amountExpected?: number;

  /** Tổng tiền thực thu */
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  amountCollected?: number;

  /** Tổng tiền đã giải ngân */
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  amountDisbursed?: number;

  /** Số dư còn lại sau kỳ */
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  amountBalance?: number;

  /** Số người nhận tiền kỳ này */
  @Column({ type: 'int', nullable: true })
  totalRecipients?: number;

  /** Thời điểm snapshot được tạo */
  @Column({ type: 'timestamptz', nullable: true })
  generatedAt?: Date;

  /** Ghi chú tổng kết */
  @Column({ type: 'text', nullable: true })
  note?: string;
}
