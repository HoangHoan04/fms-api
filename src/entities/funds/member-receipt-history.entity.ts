import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { transformer } from '../../helpers';
import { BaseEntity } from '../base.entity';
import { FundCycleEntity } from './fund-cycle.entity';
import { FundMemberEntity } from './fund-member.entity';
import { FundReceiptEntity } from './fund-receipt.entity';

/** Lịch sử nhận tiền của một thành viên qua các chu kỳ (tổng hợp) */
@Entity('member-receipt-history')
export class MemberReceiptHistoryEntity extends BaseEntity {
  /** Thành viên */
  @Column({ type: 'uuid' })
  fundMemberId: string;
  @ManyToOne(() => FundMemberEntity, (fm) => fm.receiptHistories)
  @JoinColumn({ name: 'fundMemberId' })
  fundMember: FundMemberEntity;

  /** Chu kỳ đã nhận */
  @Column({ type: 'uuid' })
  cycleId: string;
  @ManyToOne(() => FundCycleEntity)
  @JoinColumn({ name: 'cycleId' })
  cycle: FundCycleEntity;

  /** Đơn đăng ký tương ứng */
  @Column({ type: 'uuid', nullable: true })
  receiptId?: string;
  @ManyToOne(() => FundReceiptEntity)
  @JoinColumn({ name: 'receiptId' })
  receipt?: FundReceiptEntity;

  /** Số tiền thực nhận */
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    transformer: transformer,
  })
  receivedAmount: number;

  /** Thời điểm nhận */
  @Column({ type: 'timestamptz', nullable: true })
  receivedAt?: Date;
}
