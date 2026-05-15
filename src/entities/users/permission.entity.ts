import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { RolePermissionEntity } from './role-permission.entity';
import { UserPermissionEntity } from './user-permission.entity';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  @ApiProperty({
    description: 'Mã quyền',
    example: 'question:create',
  })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  @ApiProperty({ description: 'Tên quyền' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @ApiProperty({ description: 'Mô tả quyền' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Nhóm chức năng',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  module: string;

  @ApiProperty({
    description: 'Hành động',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  action: string;

  // Relations
  @OneToMany(
    () => RolePermissionEntity,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermissionEntity[];

  @OneToMany(
    () => UserPermissionEntity,
    (userPermission) => userPermission.permission,
  )
  userPermissions: UserPermissionEntity[];
}
