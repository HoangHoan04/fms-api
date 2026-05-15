import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './users/user.entity';

/** Ghi lại lịch sử đăng nhập của toàn bộ người dùng (nhân viên & thành viên) */
@Entity('login-logs')
export class LoginLogEntity extends BaseEntity {
  /** Tài khoản thực hiện đăng nhập */
  @Column({ type: 'uuid' })
  userId: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  /** Loại người dùng: employee | member | admin */
  @Column({ type: 'varchar', length: 20 })
  actorType: string;

  /** UUID hồ sơ tương ứng (Employees.id hoặc Members.id) */
  @Column({ type: 'uuid', nullable: true })
  actorId?: string;

  /** Phương thức đăng nhập: local | google | facebook */
  @Column({ type: 'varchar', length: 50, nullable: true })
  loginProvider?: string;

  /** Kết quả: success | failed | blocked */
  @Column({ type: 'varchar', length: 20 })
  status: string;

  /** Lý do thất bại: wrong_password | not_verified | account_locked | ... */
  @Column({ type: 'varchar', length: 100, nullable: true })
  failReason?: string;

  /** Địa chỉ IP của thiết bị đăng nhập */
  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress?: string;

  /** Thông tin trình duyệt / app (VD: Chrome 124, iOS Safari) */
  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent?: string;

  /** Loại thiết bị: web | mobile | desktop */
  @Column({ type: 'varchar', length: 20, nullable: true })
  deviceType?: string;

  /** Hệ điều hành: Windows | macOS | Android | iOS */
  @Column({ type: 'varchar', length: 50, nullable: true })
  os?: string;

  /** Tên trình duyệt: Chrome | Firefox | Safari | ... */
  @Column({ type: 'varchar', length: 50, nullable: true })
  browser?: string;

  /** Quốc gia (resolve từ IP, VD: Vietnam) */
  @Column({ type: 'varchar', length: 50, nullable: true })
  country?: string;

  /** Thành phố (resolve từ IP, VD: Ho Chi Minh City) */
  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  /** ID phiên đăng nhập (JWT jti hoặc session token hash) */
  @Column({ type: 'varchar', length: 255, nullable: true })
  sessionId?: string;

  /** Thời điểm đăng nhập */
  @Column({ type: 'timestamptz', nullable: true })
  loggedInAt?: Date;

  /** Thời điểm đăng xuất (null = chưa logout hoặc session hết hạn) */
  @Column({ type: 'timestamptz', nullable: true })
  loggedOutAt?: Date;

  /** Thời gian phiên làm việc tính bằng giây (tính khi logout) */
  @Column({ type: 'int', nullable: true })
  sessionDuration?: number;

  /** Bị đăng xuất cưỡng bức bởi admin không */
  @Column({ type: 'boolean', default: false })
  isForced: boolean;
}
