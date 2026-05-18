import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';

@Entity('role-permissions')
export class RolePermissionEntity extends BaseEntity {
  @ApiProperty({ description: 'ID vai trò' })
  @Column({ type: 'uuid' })
  roleId: string;

  @ApiProperty({ description: 'ID quyền' })
  @Column({ type: 'uuid' })
  permissionId: string;

  @ManyToOne(() => RoleEntity, (role) => role.rolePermissions)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'permissionId' })
  permission: PermissionEntity;
}
