import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FundEntity } from './fund.entity';
import { MemberEntity } from '../users/member.entity';
import { ContributionEntity } from './contribution.entity';
import { MemberReceiptHistoryEntity } from './member-receipt-history.entity';
import { FundReceiptEntity } from './fund-receipt.entity';

/** Danh sách thành viên tham gia một quỹ cụ thể */
@Entity('fund-members')
export class FundMemberEntity extends BaseEntity {
  /** Quỹ mà thành viên tham gia */
  @Column({ type: 'uuid' })
  fundId: string;
  @ManyToOne(() => FundEntity, (f) => f.fundMembers)
  @JoinColumn({ name: 'fundId' })
  fund: FundEntity;

  /** Thành viên tham gia */
  @Column({ type: 'uuid' })
  memberId: string;
  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: 'memberId' })
  member: MemberEntity;

  /** Ngày chính thức tham gia quỹ */
  @Column({ type: 'date', nullable: true })
  joinDate?: Date;

  /** Ngày rời khỏi quỹ (null = đang tham gia) */
  @Column({ type: 'date', nullable: true })
  leaveDate?: Date;

  /** Trạng thái: active | inactive | suspended */
  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  /** Ghi chú đặc biệt cho thành viên này trong quỹ */
  @Column({ type: 'text', nullable: true })
  note?: string;

  // Relations
  @OneToMany(() => ContributionEntity, (c) => c.fundMember)
  contributions: ContributionEntity[];

  @OneToMany(() => MemberReceiptHistoryEntity, (mrh) => mrh.fundMember)
  receiptHistories: MemberReceiptHistoryEntity[];

  @OneToMany(() => FundReceiptEntity, (fr) => fr.fundMember)
  fundReceipts: FundReceiptEntity[];
}
