import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './users/user.entity';

/** Ghi lại lịch sử đăng nhập của toàn bộ người dùng (nhân viên & thành viên) */
@Entity('login-logs')
export class LoginLogEntity extends BaseEntity {
  /** Tài khoản thực hiện đăng nhập */
  @ApiProperty({ description: 'ID tài khoản người dùng thực hiện đăng nhập' })
  @Column({ type: 'uuid' })
  userId: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  /** Loại người dùng: employee | member | admin */
  @ApiProperty({ description: 'Loại người dùng đăng nhập' })
  @Column({ type: 'varchar', length: 20 })
  actorType: string;

  /** UUID hồ sơ tương ứng (Employees.id hoặc Members.id) */
  @ApiProperty({
    description: 'ID hồ sơ tương ứng (Employees.id hoặc Members.id)',
  })
  @Column({ type: 'uuid', nullable: true })
  actorId?: string;

  /** Phương thức đăng nhập: local | google | facebook */
  @ApiProperty({ description: 'Phương thức đăng nhập' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  loginProvider?: string;

  /** Kết quả: success | failed | blocked */
  @ApiProperty({ description: 'Kết quả đăng nhập' })
  @Column({ type: 'varchar', length: 20 })
  status: string;

  /** Lý do thất bại: wrong_password | not_verified | account_locked | ... */
  @ApiProperty({ description: 'Lý do thất bại khi đăng nhập (nếu có)' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  failReason?: string;

  /** Địa chỉ IP của thiết bị đăng nhập */
  @ApiProperty({ description: 'Địa chỉ IP của thiết bị đăng nhập' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress?: string;

  /** Thông tin trình duyệt / app (VD: Chrome 124, iOS Safari) */
  @ApiProperty({
    description: 'Thông tin trình duyệt hoặc app của thiết bị đăng nhập',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent?: string;

  /** Loại thiết bị: web | mobile | desktop */
  @ApiProperty({ description: 'Loại thiết bị: web | mobile | desktop' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  deviceType?: string;

  /** Hệ điều hành: Windows | macOS | Android | iOS */
  @ApiProperty({ description: 'Hệ điều hành: Windows | macOS | Android | iOS' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  os?: string;

  /** Tên trình duyệt: Chrome | Firefox | Safari | ... */
  @ApiProperty({ description: 'Tên trình duyệt, VD: Chrome, Firefox, Safari' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  browser?: string;

  /** Quốc gia (resolve từ IP, VD: Vietnam) */
  @ApiProperty({ description: 'Quốc gia của thiết bị đăng nhập' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  country?: string;

  /** Thành phố (resolve từ IP, VD: Ho Chi Minh City) */
  @ApiProperty({ description: 'Thành phố của thiết bị đăng nhập' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  /** ID phiên đăng nhập (JWT jti hoặc session token hash) */
  @ApiProperty({
    description: 'ID phiên đăng nhập (JWT jti hoặc session token hash)',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  sessionId?: string;

  /** Thời điểm đăng nhập */
  @ApiProperty({ description: 'Thời điểm đăng nhập' })
  @Column({ type: 'timestamptz', nullable: true })
  loggedInAt?: Date;

  /** Thời điểm đăng xuất (null = chưa logout hoặc session hết hạn) */
  @ApiProperty({ description: 'Thời điểm đăng xuất (null nếu chưa logout)' })
  @Column({ type: 'timestamptz', nullable: true })
  loggedOutAt?: Date;

  /** Thời gian phiên làm việc tính bằng giây (tính khi logout) */
  @ApiProperty({
    description: 'Thời gian phiên làm việc tính bằng giây (tính khi logout)',
  })
  @Column({ type: 'int', nullable: true })
  sessionDuration?: number;

  /** Bị đăng xuất cưỡng bức bởi admin không */
  @ApiProperty({
    description: 'Phiên đăng nhập bị đăng xuất cưỡng bức bởi admin',
  })
  @Column({ type: 'boolean', default: false })
  isForced: boolean;
}
