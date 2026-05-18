import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { MemberEntity } from './member.entity';
import { UserRoleEntity } from './user-role.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã định danh ngắn gọn (VD: USR-0001)' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @ApiProperty({ description: 'Email đăng nhập' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ description: 'Tên đăng nhập' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @ApiProperty({ description: 'Mật khẩu đã hash' })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({
    description: 'Nhà cung cấp đăng nhập: local | google | facebook',
  })
  @Column({ type: 'varchar', length: 50, default: 'local' })
  loginProvider: string;

  @ApiProperty({ description: 'Google ID' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  googleId?: string;

  @ApiProperty({ description: 'Facebook ID' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  facebookId?: string;

  @ApiProperty({ description: 'Đã xác thực email?' })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Là admin? (Hoàn hoặc phó nhóm)' })
  @Column({ default: false })
  isAdmin: boolean;

  @ApiProperty({ description: 'Lần đăng nhập cuối' })
  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt?: Date;

  @ApiProperty({ description: 'Token làm mới đã mã hóa' })
  @Column({ type: 'text' })
  refreshToken: string;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user)
  userRoles: UserRoleEntity[];

  @Column({ type: 'uuid', nullable: true })
  memberId?: string;
  @OneToOne(() => MemberEntity, (member) => member.user)
  @JoinColumn({ name: 'memberId' })
  member?: MemberEntity;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.password && this.password.length < 60) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
