import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { FileArchivalEntity } from '..';
import { BaseEntity } from '../base.entity';
import { UserEntity } from './user.entity';
import { FundEntity } from '../funds/fund.entity';

/** Hồ sơ nhân viên quản lý hệ thống quỹ */
@Entity('employees')
export class EmployeeEntity extends BaseEntity {
  /** Liên kết tài khoản đăng nhập (1-1) */
  @Column({ type: 'uuid', nullable: true })
  userId: string;
  @OneToOne(() => UserEntity, (user) => user.employee)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  /** Mã nhân viên, VD: EMP-0001 */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  code: string;

  /** Họ tên đầy đủ */
  @Column({ type: 'varchar', length: 100, nullable: true })
  fullName: string;

  /** Tên gọi ngắn */
  @Column({ type: 'varchar', length: 100, nullable: true })
  shortName?: string;

  /** Email công việc */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email: string;

  /** Số điện thoại */
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  /** Giới tính: Male | Female | Other */
  @Column({ type: 'varchar', length: 20, nullable: true })
  gender?: string;

  /** Ngày sinh */
  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  /** Ảnh đại diện nhân viên */
  @Column({ type: 'uuid', nullable: true })
  avatarFileId?: string;
  @ManyToOne(() => FileArchivalEntity)
  @JoinColumn({ name: 'avatarFileId' })
  avatarFile?: FileArchivalEntity;

  /** Ghi chú về nhân viên */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /** Phòng ban (nếu có cơ cấu tổ chức) */
  @Column({ type: 'varchar', length: 100, nullable: true })
  department?: string;

  /** Chức vụ */
  @Column({ type: 'varchar', length: 100, nullable: true })
  position?: string;

  /** Ngày bắt đầu làm việc */
  @Column({ type: 'date', nullable: true })
  joinDate?: Date;

  /** Ngày nghỉ việc (null = đang làm) */
  @Column({ type: 'date', nullable: true })
  leaveDate?: Date;

  /** Ảnh đại diện (legacy relation) */
  @OneToMany(() => FileArchivalEntity, (p) => p.employee)
  avatar: Promise<FileArchivalEntity[]>;

  /** Các quỹ được quản lý bởi nhân viên này */
  @OneToMany(() => FundEntity, (f) => f.manager)
  managedFunds: FundEntity[];
}
