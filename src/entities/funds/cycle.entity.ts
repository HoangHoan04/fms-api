import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { transformer } from '../../helpers';
import { BaseEntity } from '../base.entity';
import { ContributionEntity } from './contribution.entity';
import { CycleRegistrationEntity } from './cycle-registration.entity';
import { DisbursementEntity } from './disbursement.entity';

/** Chu kỳ đóng góp và chi trả */
@Entity('cycles')
export class CycleEntity extends BaseEntity {
  @Index({ unique: true })
  @ApiProperty({ description: 'Mã chu kỳ (unique)' })
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @ApiProperty({ description: 'Chỉ số chu kỳ trong năm, bắt đầu từ 1' })
  @Column({ type: 'int' })
  cycleIndex: number;

  @ApiProperty({ description: 'Tên chu kỳ' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Tháng của chu kỳ (1-12)' })
  @Column({ type: 'int' })
  month: number;

  @ApiProperty({ description: 'Năm của chu kỳ' })
  @Column({ type: 'int' })
  year: number;

  @ApiProperty({ description: 'Ngày bắt đầu chu kỳ' })
  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @ApiProperty({ description: 'Ngày kết thúc chu kỳ' })
  @Column({ type: 'date', nullable: true })
  deadlineDate?: Date;

  @ApiProperty({ description: 'Ngày chi trả dự kiến' })
  @Column({ type: 'date', nullable: true })
  payoutDate?: Date;

  @ApiProperty({ description: 'Số tiền đóng góp dự kiến cho mỗi thành viên' })
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    transformer: transformer,
  })
  contributionAmount: number;

  @ApiProperty({ description: 'Tổng số tiền dự kiến thu được trong chu kỳ' })
  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    transformer: transformer,
  })
  totalExpected: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
    transformer: transformer,
  })
  totalCollected: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 0,
    transformer: transformer,
  })
  totalDisbursed: number;

  @Column({ type: 'uuid', nullable: true })
  receiverId?: string;

  @Column({ type: 'varchar', length: 20, default: 'open' })
  status: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @OneToMany(() => ContributionEntity, (c) => c.cycle)
  contributions: ContributionEntity[];

  @OneToMany(() => CycleRegistrationEntity, (cr) => cr.cycle)
  registrations: CycleRegistrationEntity[];

  @OneToMany(() => DisbursementEntity, (d) => d.cycle)
  disbursements: DisbursementEntity[];
}
