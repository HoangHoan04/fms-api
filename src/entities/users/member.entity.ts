import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserEntity } from '.';
import { FileArchivalEntity } from '..';
import { BaseEntity } from '../base.entity';
import { MemberBankAccountEntity } from './member-bank-account.entity';

/** Hồ sơ thành viên tham gia quỹ nhóm */
@Entity('members')
export class MemberEntity extends BaseEntity {
  /** Liên kết tài khoản đăng nhập (1-1, có thể null nếu nhập tay) */
  @ApiProperty({ description: 'ID tài khoản người dùng liên kết (nếu có)' })
  @Column({ type: 'uuid', nullable: true })
  userId: string;
  @OneToOne(() => UserEntity, (user) => user.member)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  /** Mã thành viên, VD: MBR-0001 */
  @ApiProperty({ description: 'Mã thành viên, VD: MBR-0001' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  code: string;

  /** Họ tên đầy đủ */
  @ApiProperty({ description: 'Họ tên đầy đủ của thành viên' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  fullName: string;

  /** Tên gọi ngắn / biệt danh */
  @ApiProperty({ description: 'Tên gọi ngắn hoặc biệt danh của thành viên' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  shortName?: string;

  /** Email liên hệ */
  @ApiProperty({ description: 'Email liên hệ của thành viên' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email: string;

  /** Số điện thoại */
  @ApiProperty({ description: 'Số điện thoại liên hệ của thành viên' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  /** Giới tính: Male | Female | Other */
  @ApiProperty({ description: 'Giới tính của thành viên' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  gender?: string;

  /** Ngày sinh */
  @ApiProperty({ description: 'Ngày sinh của thành viên' })
  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  /** Ghi chú thêm về thành viên */
  @ApiProperty({ description: 'Ghi chú thêm về thành viên' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  /** Danh sách tài khoản ngân hàng */
  @OneToMany(() => MemberBankAccountEntity, (p) => p.member)
  bankAccounts: MemberBankAccountEntity[];

  /** Ảnh đại diện */
  @ApiProperty({ description: 'URL avatar của thành viên' })
  @OneToMany(() => FileArchivalEntity, (p) => p.member)
  avatar: Promise<FileArchivalEntity[]>;
}
