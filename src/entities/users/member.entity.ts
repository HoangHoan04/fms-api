import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FileArchivalEntity } from '../file-archival.entity';
import { UserEntity } from './user.entity';

@Entity('members')
export class MemberEntity extends BaseEntity {
  @ApiProperty({
    description:
      'ID tài khoản người dùng liên kết (null nếu admin nhập tay profile trước)',
  })
  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @OneToOne(() => UserEntity, (user) => user.member)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @ApiProperty({ description: 'Mã thành viên: MBR-0001 → MBR-0020' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @ApiProperty({ description: 'Họ tên đầy đủ' })
  @Column({ type: 'varchar', length: 100 })
  fullName: string;

  @ApiProperty({ description: 'Biệt danh gọi trong nhóm' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname?: string;

  @ApiProperty({
    description: 'Ngày sinh nhật - dùng để quét chạy CronJob tự động',
  })
  @Column({ type: 'date' })
  birthday: Date;

  @ApiProperty({ description: 'Email nhận thông báo' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ description: 'Số điện thoại nhận tin SMS hoặc MoMo' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @ApiProperty({ description: 'Số điện thoại đăng ký Zalo' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  zaloPhone?: string;

  @ApiProperty({
    description: 'Zalo User ID nhận tin nhắn trực tiếp qua Official Account',
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  zaloUserId?: string;

  @ApiProperty({ description: 'Số điện thoại MoMo' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  momoPhone?: string;

  @ApiProperty({ description: 'Tên ngân hàng' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankName?: string;

  @ApiProperty({ description: 'Số tài khoản ngân hàng' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  bankAccountNo?: string;

  @ApiProperty({ description: 'Tên chủ tài khoản ngân hàng' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankAccountName?: string;

  @ApiProperty({ description: 'ID ảnh QR code ngân hàng' })
  @Column({ type: 'uuid', nullable: true })
  qrCodeFileId?: string;
  @OneToOne(() => FileArchivalEntity)
  @JoinColumn({ name: 'qrCodeFileId' })
  qrCodeFile?: FileArchivalEntity;

  @ApiProperty({ description: 'ID ảnh đại diện' })
  @Column({ type: 'uuid', nullable: true })
  avatarFileId?: string;
  @OneToOne(() => FileArchivalEntity)
  @JoinColumn({ name: 'avatarFileId' })
  avatarFile?: FileArchivalEntity;

  @ApiProperty({ description: 'Thứ tự danh sách trong nhóm hụi (1 -> 20)' })
  @Column({ type: 'int' })
  orderIndex: number;

  @ApiProperty({ description: 'Ngày tham gia nhóm hụi' })
  @Column({ type: 'date', nullable: true })
  joinDate?: Date;

  @ApiProperty({ description: 'Ghi chú riêng' })
  @Column({ type: 'text', nullable: true })
  note?: string;

  @ApiProperty({ description: 'Trạng thái: active | inactive | left' })
  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;
}
