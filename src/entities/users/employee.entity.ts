import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { FileArchivalEntity } from '..';
import { BaseEntity } from '../base.entity';
import { FundEntity } from '../funds/fund.entity';
import { UserEntity } from './user.entity';

/** Hồ sơ nhân viên quản lý hệ thống quỹ */
@Entity('employees')
export class EmployeeEntity extends BaseEntity {
  /** Liên kết tài khoản đăng nhập (1-1) */
  @ApiProperty({ description: 'ID tài khoản người dùng liên kết (nếu có)' })
  @Column({ type: 'uuid', nullable: true })
  userId: string;
  @OneToOne(() => UserEntity, (user) => user.employee)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  /** Mã nhân viên, VD: EMP-0001 */
  @ApiProperty({ description: 'Mã nhân viên, VD: EMP-0001' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  code: string;

  /** Họ tên đầy đủ */
  @ApiProperty({ description: 'Họ tên đầy đủ của nhân viên' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  fullName: string;

  /** Tên gọi ngắn */
  @ApiProperty({ description: 'Tên gọi ngắn hoặc biệt danh của nhân viên' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  shortName?: string;

  /** Email công việc */
  @ApiProperty({ description: 'Email công việc của nhân viên' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email: string;

  /** Số điện thoại */
  @ApiProperty({ description: 'Số điện thoại liên hệ của nhân viên' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  /** Giới tính: Male | Female | Other */
  @ApiProperty({ description: 'Giới tính của nhân viên' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  gender?: string;

  /** Ngày sinh */
  @ApiProperty({ description: 'Ngày sinh của nhân viên' })
  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  /** Ghi chú về nhân viên */
  @ApiProperty({ description: 'Ghi chú hoặc mô tả về nhân viên' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  /** Ảnh đại diện   */
  @OneToMany(() => FileArchivalEntity, (p) => p.employee)
  avatar: Promise<FileArchivalEntity[]>;

  /** Các quỹ được quản lý bởi nhân viên này */
  @OneToMany(() => FundEntity, (f) => f.manager)
  managedFunds: FundEntity[];
}
