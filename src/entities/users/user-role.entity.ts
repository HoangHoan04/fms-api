import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';

@Entity('user-roles')
export class UserRoleEntity extends BaseEntity {
  @ApiProperty({ description: 'ID người dùng' })
  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ description: 'ID vai trò' })
  @Column({ type: 'uuid' })
  roleId: string;

  @ManyToOne(() => UserEntity, (user) => user.userRoles)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;
}
