import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FundReceiptEntity } from './fund-receipt.entity';
import { UserEntity } from '../users/user.entity';

/** Lịch sử phê duyệt / thay đổi trạng thái của đơn đăng ký nhận tiền */
@Entity('fund-receipt-approvals')
export class FundReceiptApprovalEntity extends BaseEntity {
  /** Đơn đăng ký được thao tác */
  @Column({ type: 'uuid' })
  receiptId: string;
  @ManyToOne(() => FundReceiptEntity, (fr) => fr.approvals)
  @JoinColumn({ name: 'receiptId' })
  receipt: FundReceiptEntity;

  /** Trạng thái trước khi thay đổi */
  @Column({ type: 'varchar', length: 20, nullable: true })
  fromStatus?: string;

  /** Trạng thái sau khi thay đổi */
  @Column({ type: 'varchar', length: 20 })
  toStatus: string;

  /** Người thực hiện hành động */
  @Column({ type: 'uuid', nullable: true })
  actionBy?: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'actionBy' })
  actor?: UserEntity;

  /** Ghi chú lý do chuyển trạng thái */
  @Column({ type: 'text', nullable: true })
  actionNote?: string;

  /** Thời điểm thực hiện hành động */
  @Column({ type: 'timestamptz', nullable: true })
  actionAt?: Date;
}
