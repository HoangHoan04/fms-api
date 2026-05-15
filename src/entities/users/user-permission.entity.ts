import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserEntity } from './user.entity';
import { PermissionEntity } from './permission.entity';

@Entity('user-permissions')
export class UserPermissionEntity extends BaseEntity {
  @ApiProperty({ description: 'ID người dùng' })
  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ description: 'ID quyền' })
  @Column({ type: 'uuid' })
  permissionId: string;

  @ApiProperty({
    description: 'Loại cấp quyền: Allow hoặc Deny (Deny ưu tiên cao hơn Role)',
    enum: ['Allow', 'Deny'],
  })
  @Column({ type: 'varchar', length: 10 })
  grantType: string;

  @ApiProperty({ description: 'Lý do cấp/thu hồi quyền đặc biệt' })
  @Column({ type: 'text', nullable: true })
  reason: string;

  @ApiProperty({ description: 'ID người cấp quyền' })
  @Column({ type: 'uuid', nullable: true })
  grantedBy: string;

  @ApiProperty({ description: 'Thời hạn hết hiệu lực (null = vĩnh viễn)' })
  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date;

  // Relations
  @ManyToOne(() => UserEntity, (user) => user.userPermissions)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => PermissionEntity, (permission) => permission.userPermissions)
  @JoinColumn({ name: 'permissionId' })
  permission: PermissionEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'grantedBy' })
  grantedByUser: UserEntity;
}
