import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RoleEntity, UserEntity } from '.';
import { BaseEntity } from '../base.entity';

@Entity('user-roles')
export class UserRoleEntity extends BaseEntity {
  @ApiProperty({ description: 'ID người dùng' })
  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ description: 'ID role' })
  @Column({ type: 'uuid' })
  roleId: string;

  @ManyToOne(() => UserEntity, (user) => user.userRoles)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;
}
