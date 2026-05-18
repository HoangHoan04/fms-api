import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './users/user.entity';

@Entity('login-logs')
export class LoginLogEntity extends BaseEntity {
  @ApiProperty({ description: 'ID tài khoản người dùng thực hiện đăng nhập' })
  @Column({ type: 'uuid' })
  userId: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiProperty({ description: 'Kết quả: success | failed | blocked' })
  @Column({ type: 'varchar', length: 20 })
  status: string;

  @ApiProperty({
    description:
      'Lý do thất bại: wrong_password | not_verified | account_locked | ...',
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  failReason?: string;

  @ApiProperty({ description: 'Địa chỉ IP của thiết bị đăng nhập' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress?: string;

  @ApiProperty({ description: 'Thông tin trình duyệt / app' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent?: string;

  @ApiProperty({ description: 'Loại thiết bị: web | mobile | desktop' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  deviceType?: string;

  @ApiProperty({ description: 'Thời điểm đăng nhập' })
  @Column({ type: 'timestamptz', nullable: true })
  loggedInAt?: Date;
}
