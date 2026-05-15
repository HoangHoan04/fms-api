import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { FileArchivalEntity } from '..';
import { BaseEntity } from '../base.entity';
import { MemberEntity } from './member.entity';

/** Tài khoản ngân hàng của thành viên (một member có thể có nhiều) */
@Entity('member_bank_accounts')
export class MemberBankAccountEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thành viên' })
  @Column({ type: 'uuid' })
  memberId: string;
  @ManyToOne(() => MemberEntity, (p) => p.bankAccounts)
  @JoinColumn({ name: 'memberId' })
  member: MemberEntity;

  @ApiProperty({ description: 'Tên ngân hàng, VD: Vietcombank, MB Bank' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankName?: string;

  @ApiProperty({ description: 'Số tài khoản ngân hàng' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  bankAccountNo?: string;

  @ApiProperty({ description: 'Tên chủ tài khoản' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankAccountName?: string;

  /** Ảnh đại diện */
  @ApiProperty({ description: 'URL avatar của thành viên' })
  @OneToMany(() => FileArchivalEntity, (p) => p.qrCode)
  qrCode: Promise<FileArchivalEntity[]>;
}
