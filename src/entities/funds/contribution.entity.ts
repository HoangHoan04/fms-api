import { transformer } from '@/helpers';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FileArchivalEntity } from '../file-archival.entity';
import { EmployeeEntity } from '../users/employee.entity';
import { ContributionReminderEntity } from './contribution-reminder.entity';
import { FundCycleEntity } from './fund-cycle.entity';
import { FundMemberEntity } from './fund-member.entity';

/** Phiếu đóng tiền của từng thành viên trong mỗi chu kỳ */
@Entity('contributions')
export class ContributionEntity extends BaseEntity {
  /** Chu kỳ mà khoản đóng này thuộc về */
  @Column({ type: 'uuid' })
  cycleId: string;
  @ManyToOne(() => FundCycleEntity, (fc) => fc.contributions)
  @JoinColumn({ name: 'cycleId' })
  cycle: FundCycleEntity;

  /** Thành viên thực hiện đóng tiền */
  @Column({ type: 'uuid' })
  fundMemberId: string;
  @ManyToOne(() => FundMemberEntity, (fm) => fm.contributions)
  @JoinColumn({ name: 'fundMemberId' })
  fundMember: FundMemberEntity;

  /** Số tiền đóng thực tế */
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    transformer: transformer,
  })
  amount: number;

  /** Số tiền cần đóng theo quy định kỳ này */
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    transformer: transformer,
  })
  requiredAmount: number;

  /** Thời điểm xác nhận đã nhận được tiền */
  @Column({ type: 'timestamptz', nullable: true })
  paidAt?: Date;

  /** Hạn đóng tiền cho thành viên này */
  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  /** Phương thức thanh toán: bank_transfer | cash | qr_code */
  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentMethod?: string;

  /** Mã giao dịch ngân hàng / biên lai tham chiếu */
  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionRef?: string;

  /** Ảnh chứng từ / biên lai chuyển khoản */
  @Column({ type: 'uuid', nullable: true })
  proofFileId?: string;
  @ManyToOne(() => FileArchivalEntity)
  @JoinColumn({ name: 'proofFileId' })
  proofFile?: FileArchivalEntity;

  /** Trạng thái: pending | paid | late | waived | overdue */
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  /** Đóng trễ so với hạn quy định không */
  @Column({ type: 'boolean', default: false })
  isLate: boolean;

  /** Số ngày trễ so với dueDate */
  @Column({ type: 'int', default: 0 })
  lateDays: number;

  /** Phí phạt trễ hạn (nếu có quy định) */
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
    transformer: transformer,
  })
  lateFee: number;

  /** Nhân viên xác nhận đã nhận tiền */
  @Column({ type: 'uuid', nullable: true })
  confirmedBy?: string;
  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'confirmedBy' })
  confirmer?: EmployeeEntity;

  /** Ghi chú về khoản đóng (VD: đóng bù kỳ trước) */
  @Column({ type: 'text', nullable: true })
  note?: string;

  // Relations
  @OneToMany(() => ContributionReminderEntity, (cr) => cr.contribution)
  reminders: ContributionReminderEntity[];
}
