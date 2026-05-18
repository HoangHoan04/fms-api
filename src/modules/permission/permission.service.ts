import { IdDto, PaginationDto, UserDto } from '@/dto';
import {
  PermissionRepository,
  RolePermissionRepository,
} from '@/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { ActionLogService } from '../action-log/action-log.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepo: PermissionRepository,
    private readonly rolePermissionRepo: RolePermissionRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async pagination(data: PaginationDto) {}

  async selectbox() {}

  async create(data: CreatePermissionDto, user: UserDto) {}

  async findById(data: IdDto) {}

  async update(data: UpdatePermissionDto, user: UserDto) {}

  async deactivate(data: IdDto, user: UserDto) {}

  async activate(data: IdDto, user: UserDto) {}

  async getPermissionsByRole(roleId: string) {}

  async assignPermissionsToRole() {}

  async removePermissionFromRole() {}

  async getPermissionsByUser(userId: string) {}

  async assignPermissionToUser() {}

  async removeUserPermission(data: IdDto, user: UserDto) {}
}
