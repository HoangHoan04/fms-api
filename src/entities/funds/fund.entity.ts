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
import { EmployeeEntity } from '../users/employee.entity';
import { FundMemberEntity } from './fund-member.entity';
import { FundCycleEntity } from './fund-cycle.entity';
import { FundTransactionEntity } from './fund-transaction.entity';

/** Quỹ nhóm – thông tin chung về quỹ */
@Entity('funds')
export class FundEntity extends BaseEntity {
  /** Mã quỹ, VD: FUND-2024 */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  /** Tên quỹ (VD: Quỹ tương trợ nhân viên 2024) */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /** Mô tả mục đích, điều lệ quỹ */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /** Số tiền mỗi thành viên đóng mỗi kỳ (VND) */
  @Column({ type: 'decimal', precision: 18, scale: 2 })
  contributionAmount: number;

  /** Đơn vị tiền tệ (mặc định VND) */
  @Column({ type: 'varchar', length: 10, default: 'VND' })
  currency: string;

  /** Loại chu kỳ: monthly | quarterly | yearly | custom */
  @Column({ type: 'varchar', length: 20 })
  cycleType: string;

  /** Số ngày mỗi chu kỳ (dùng khi cycleType = custom) */
  @Column({ type: 'int', nullable: true })
  cycleDurationDays?: number;

  /** Số thành viên tối đa được nhận tiền mỗi kỳ */
  @Column({ type: 'int', default: 1 })
  maxRecipientPerCycle: number;

  /** Tổng số thành viên dự kiến tham gia */
  @Column({ type: 'int', nullable: true })
  totalMembers?: number;

  /** Trạng thái quỹ: draft | active | paused | closed */
  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  /** Ngày bắt đầu hoạt động của quỹ */
  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  /** Ngày kết thúc dự kiến (null = không giới hạn) */
  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  /** Nhân viên phụ trách quản lý quỹ */
  @Column({ type: 'uuid', nullable: true })
  managedBy?: string;
  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'managedBy' })
  manager?: EmployeeEntity;

  // Relations
  @OneToMany(() => FundMemberEntity, (fm) => fm.fund)
  fundMembers: FundMemberEntity[];

  @OneToMany(() => FundCycleEntity, (fc) => fc.fund)
  fundCycles: FundCycleEntity[];

  @OneToMany(() => FundTransactionEntity, (ft) => ft.fund)
  fundTransactions: FundTransactionEntity[];
}
