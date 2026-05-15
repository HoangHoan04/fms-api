import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FileArchivalEntity } from '../file-archival.entity';
import { EmployeeEntity } from '../users/employee.entity';
import { DisbursementEntity } from './disbursement.entity';
import { FundCycleEntity } from './fund-cycle.entity';
import { FundMemberEntity } from './fund-member.entity';
import { FundReceiptApprovalEntity } from './fund-receipt-approval.entity';

/** Đơn đăng ký nhận tiền từ quỹ trong một chu kỳ */
@Entity('fund-receipts')
export class FundReceiptEntity extends BaseEntity {
  /** Chu kỳ mà đơn đăng ký thuộc về */
  @Column({ type: 'uuid' })
  cycleId: string;
  @ManyToOne(() => FundCycleEntity, (fc) => fc.fundReceipts)
  @JoinColumn({ name: 'cycleId' })
  cycle: FundCycleEntity;

  /** Thành viên đăng ký nhận tiền */
  @Column({ type: 'uuid' })
  fundMemberId: string;
  @ManyToOne(() => FundMemberEntity, (fm) => fm.fundReceipts)
  @JoinColumn({ name: 'fundMemberId' })
  fundMember: FundMemberEntity;

  /** Mã đơn, VD: RCT-2024-001 */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  /** Lý do xin nhận tiền quỹ (hoàn cảnh, mục đích) */
  @Column({ type: 'text', nullable: true })
  reason?: string;

  /** Số tiền đề nghị nhận */
  @Column({ type: 'decimal', precision: 18, scale: 2 })
  requestedAmount: number;

  /** Số tiền được phê duyệt (có thể khác requestedAmount) */
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  approvedAmount?: number;

  /** Mức ưu tiên xét duyệt (0=bình thường, 1=ưu tiên, 2=khẩn cấp) */
  @Column({ type: 'int', default: 0 })
  priority: number;

  /** Trạng thái: pending | reviewing | approved | rejected | paid_out | cancelled */
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  /** Thời điểm nộp đơn */
  @Column({ type: 'timestamptz', nullable: true })
  submittedAt?: Date;

  /** Thời điểm hoàn thành xét duyệt */
  @Column({ type: 'timestamptz', nullable: true })
  reviewedAt?: Date;

  /** Nhân viên thực hiện xét duyệt */
  @Column({ type: 'uuid', nullable: true })
  reviewedBy?: string;
  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'reviewedBy' })
  reviewer?: EmployeeEntity;

  /** Nhận xét của người xét duyệt */
  @Column({ type: 'text', nullable: true })
  reviewNote?: string;

  /** Lý do từ chối (nếu status = rejected) */
  @Column({ type: 'text', nullable: true })
  rejectedReason?: string;

  /** Ngân hàng nhận tiền (snapshot tại thời điểm đăng ký) */
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankName?: string;

  /** Số tài khoản nhận tiền */
  @Column({ type: 'varchar', length: 50, nullable: true })
  bankAccountNo?: string;

  /** Tên chủ tài khoản nhận tiền */
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankAccountName?: string;

  // Relations
  @OneToMany(() => FileArchivalEntity, (p) => p.fundReceipt)
  documents: Promise<FileArchivalEntity[]>;

  @OneToMany(() => FundReceiptApprovalEntity, (fra) => fra.receipt)
  approvals: FundReceiptApprovalEntity[];

  @OneToMany(() => DisbursementEntity, (d) => d.receipt)
  disbursements: DisbursementEntity[];
}
