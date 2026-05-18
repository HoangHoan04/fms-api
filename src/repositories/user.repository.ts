import {
  MemberEntity,
  PermissionEntity,
  RoleEntity,
  RolePermissionEntity,
  UserEntity,
  UserRoleEntity,
} from '@/entities/users';
import { CustomRepository } from '@/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}

@CustomRepository(MemberEntity)
export class MemberRepository extends Repository<MemberEntity> {}

@CustomRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> {}

@CustomRepository(UserRoleEntity)
export class UserRoleRepository extends Repository<UserRoleEntity> {}

@CustomRepository(PermissionEntity)
export class PermissionRepository extends Repository<PermissionEntity> {}

@CustomRepository(RolePermissionEntity)
export class RolePermissionRepository extends Repository<RolePermissionEntity> {}
