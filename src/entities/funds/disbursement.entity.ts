import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FundReceiptEntity } from './fund-receipt.entity';
import { FundCycleEntity } from './fund-cycle.entity';
import { EmployeeEntity } from '../users/employee.entity';
import { FileArchivalEntity } from '../file-archival.entity';
import { DisbursementConfirmationEntity } from './disbursement-confirmation.entity';

/** Phiếu giải ngân – ghi nhận việc chuyển tiền thực tế cho người nhận */
@Entity('disbursements')
export class DisbursementEntity extends BaseEntity {
  /** Đơn đăng ký nhận tiền được giải ngân */
  @Column({ type: 'uuid' })
  receiptId: string;
  @ManyToOne(() => FundReceiptEntity, (fr) => fr.disbursements)
  @JoinColumn({ name: 'receiptId' })
  receipt: FundReceiptEntity;

  /** Chu kỳ giải ngân */
  @Column({ type: 'uuid' })
  cycleId: string;
  @ManyToOne(() => FundCycleEntity, (fc) => fc.disbursements)
  @JoinColumn({ name: 'cycleId' })
  cycle: FundCycleEntity;

  /** Số tiền thực tế đã chuyển */
  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  /** Thời điểm chuyển tiền */
  @Column({ type: 'timestamptz', nullable: true })
  disbursedAt?: Date;

  /** Phương thức: bank_transfer | cash */
  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentMethod?: string;

  /** Mã giao dịch chuyển khoản ngân hàng */
  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionRef?: string;

  /** Ảnh / file chứng từ chuyển tiền */
  @Column({ type: 'uuid', nullable: true })
  proofFileId?: string;
  @ManyToOne(() => FileArchivalEntity)
  @JoinColumn({ name: 'proofFileId' })
  proofFile?: FileArchivalEntity;

  /** Nhân viên thực hiện giải ngân */
  @Column({ type: 'uuid', nullable: true })
  disbursedBy?: string;
  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'disbursedBy' })
  disburser?: EmployeeEntity;

  /** Ngân hàng nhận */
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankName?: string;

  /** Số tài khoản nhận */
  @Column({ type: 'varchar', length: 50, nullable: true })
  bankAccountNo?: string;

  /** Tên chủ tài khoản nhận */
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankAccountName?: string;

  /** Ghi chú về lần giải ngân */
  @Column({ type: 'text', nullable: true })
  note?: string;

  // Relations
  @OneToMany(() => DisbursementConfirmationEntity, (dc) => dc.disbursement)
  confirmations: DisbursementConfirmationEntity[];
}
