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
import {
  EmployeeEntity,
  MemberEntity,
  UserPermissionEntity,
  UserRoleEntity,
} from '.';
import { BaseEntity } from '../base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã người dùng' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  code: string;

  @ApiProperty({ description: 'Email' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email: string;

  @ApiProperty({ description: 'Tên đăng nhập' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  username: string;

  @ApiProperty({ description: 'Mật khẩu (đã hash)' })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({
    description: 'Nhà cung cấp đăng nhập',
    enum: ['local', 'google', 'facebook'],
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  loginProvider: string;

  @ApiProperty({ description: 'Google ID' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  googleId: string;

  @ApiProperty({ description: 'Facebook ID' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  facebookId: string;

  @ApiProperty({ description: 'Đã xác thực email?' })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Là admin?' })
  @Column({ default: false })
  isAdmin: boolean;

  @ApiProperty({ description: 'Lần đăng nhập cuối' })
  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt: Date;

  @ApiProperty({ description: 'Tài khoản có đang hoạt động không' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Refresh token đã mã hóa' })
  @Column({ type: 'text' })
  refreshToken: string;

  // Relations
  @ApiProperty({ description: '' })
  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user)
  userRoles: UserRoleEntity[];

  @Column({ type: 'uuid', nullable: true })
  memberId?: string;
  @OneToOne(() => MemberEntity, (member) => member.user)
  @JoinColumn({ name: 'memberId' })
  member?: MemberEntity;

  @Column({ type: 'uuid', nullable: true })
  employeeId?: string;
  @OneToOne(() => EmployeeEntity, (employee) => employee.user)
  @JoinColumn({ name: 'employeeId' })
  employee?: EmployeeEntity;

  @OneToMany(
    () => UserPermissionEntity,
    (userPermission) => userPermission.user,
  )
  userPermissions: UserPermissionEntity[];

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
