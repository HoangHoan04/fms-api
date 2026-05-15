import {
  EmployeeEntity,
  MemberEntity,
  PermissionEntity,
  RoleEntity,
  RolePermissionEntity,
  UserEntity,
  UserPermissionEntity,
  UserRoleEntity,
  VerifyOtpEntity,
} from '@/entities/users';
import { CustomRepository } from '@/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}

@CustomRepository(MemberEntity)
export class MemberRepository extends Repository<MemberEntity> {}

@CustomRepository(VerifyOtpEntity)
export class VerifyOtpRepository extends Repository<VerifyOtpEntity> {}

@CustomRepository(EmployeeEntity)
export class EmployeeRepository extends Repository<EmployeeEntity> {}

@CustomRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> {}

@CustomRepository(UserRoleEntity)
export class UserRoleRepository extends Repository<UserRoleEntity> {}

@CustomRepository(PermissionEntity)
export class PermissionRepository extends Repository<PermissionEntity> {}

@CustomRepository(RolePermissionEntity)
export class RolePermissionRepository extends Repository<RolePermissionEntity> {}

@CustomRepository(UserPermissionEntity)
export class UserPermissionRepository extends Repository<UserPermissionEntity> {}
