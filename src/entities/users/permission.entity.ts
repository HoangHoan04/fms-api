import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { RolePermissionEntity } from './role-permission.entity';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã quyền (VD: CYCLE_CREATE, MEMBER_VIEW)' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  @ApiProperty({ description: 'Tên quyền' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @ApiProperty({ description: 'Mô tả quyền' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Nhóm chức năng: fund | member | report | birthday',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  module?: string;

  @ApiProperty({ description: 'Hành động: create | read | update | delete' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  action?: string;

  @OneToMany(
    () => RolePermissionEntity,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermissionEntity[];
}
