import { IdDto, PaginationDto } from '@/dto';
import { PermissionEntity } from '@/entities/users';
import { transformKeys } from '@/helpers/objectHelper';
import {
  PermissionRepository,
  RolePermissionRepository,
  UserPermissionRepository,
} from '@/repositories/user.repository';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  AssignPermissionsToRoleDto,
  AssignPermissionToUserDto,
  CreatePermissionDto,
  RemovePermissionFromRoleDto,
  UpdatePermissionDto,
} from './dto';

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepo: PermissionRepository,
    private readonly rolePermissionRepo: RolePermissionRepository,
    private readonly userPermissionRepo: UserPermissionRepository,
  ) {}

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<PermissionEntity> = {};

    if (data.where.code) whereCon.code = ILike(`%${data.where.code}%`);
    if (data.where.name) whereCon.name = ILike(`%${data.where.name}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [items, total] = await this.permissionRepo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: items,
      total,
    };
  }

  async selectbox() {
    return await this.permissionRepo.find({
      where: { isDeleted: false },
      select: {
        id: true,
        code: true,
        name: true,
        module: true,
        action: true,
      },
      order: { module: 'ASC', code: 'ASC' },
    });
  }

  async findById(data: IdDto) {
    const permission = await this.permissionRepo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!permission) throw new NotFoundException('Không tìm thấy quyền hạn');
    const res = transformKeys(permission);
    return {
      data: res,
      message: 'Tìm kiếm quyền hạn thành công',
    };
  }

  async create(data: CreatePermissionDto, userId: string) {
    const existing = await this.permissionRepo.findOne({
      where: { code: data.code, isDeleted: false },
    });
    if (existing) throw new ConflictException('Mã quyền đã tồn tại');

    const item = this.permissionRepo.create({
      ...data,
      id: uuidv4(),
      createdBy: userId,
    });
    return await this.permissionRepo.save(item);
  }

  async update(id: string, data: UpdatePermissionDto, userId: string) {}

  async deactivate(id: string, userId: string) {}

  async activate(id: string, userId: string) {}

  async getPermissionsByRole(roleId: string) {
    return await this.rolePermissionRepo.find({
      where: { roleId, isDeleted: false },
      relations: {
        permission: true,
      },
      select: {
        permission: {
          id: true,
          code: true,
          name: true,
          module: true,
          action: true,
        },
      },
    });
  }

  async assignPermissionsToRole(
    data: AssignPermissionsToRoleDto,
    userId: string,
  ) {
    const { roleId, permissionIds } = data;
    const existingRolePerms = await this.rolePermissionRepo.find({
      where: { roleId, isDeleted: false },
    });
    const existingPermIds = existingRolePerms.map((rp) => rp.permissionId);
    const newPermIds = permissionIds.filter(
      (id) => !existingPermIds.includes(id),
    );

    if (newPermIds.length === 0) {
      return { success: true, message: 'Tất cả quyền đã được gán trước đó' };
    }

    const items = newPermIds.map((permissionId) =>
      this.rolePermissionRepo.create({
        id: uuidv4(),
        roleId,
        permissionId,
        createdBy: userId,
      }),
    );

    await this.rolePermissionRepo.save(items);
    return { success: true, assigned: newPermIds.length };
  }

  async removePermissionFromRole(
    data: RemovePermissionFromRoleDto,
    userId: string,
  ) {
    const { roleId, permissionId } = data;
    const item = await this.rolePermissionRepo.findOne({
      where: { roleId, permissionId, isDeleted: false },
    });
    if (!item)
      throw new NotFoundException('Không tìm thấy quyền trong Role này');

    await this.rolePermissionRepo.update(item.id, {
      isDeleted: true,
      updatedBy: userId,
    });
    return { success: true };
  }

  async getPermissionsByUser(userId: string) {
    return await this.userPermissionRepo.find({
      where: { userId, isDeleted: false },
      relations: {
        permission: true,
      },
      select: {
        permission: {
          id: true,
          code: true,
          name: true,
          module: true,
          action: true,
        },
      },
    });
  }

  async assignPermissionToUser(
    data: AssignPermissionToUserDto,
    grantedByUserId: string,
  ) {
    const existing = await this.userPermissionRepo.findOne({
      where: {
        userId: data.userId,
        permissionId: data.permissionId,
        isDeleted: false,
      },
    });
    if (existing) {
      await this.userPermissionRepo.update(existing.id, {
        grantType: data.grantType,
        reason: data.reason,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        grantedBy: grantedByUserId,
        updatedBy: grantedByUserId,
      });
      return { success: true, updated: true };
    }

    const item = this.userPermissionRepo.create({
      id: uuidv4(),
      userId: data.userId,
      permissionId: data.permissionId,
      grantType: data.grantType,
      reason: data.reason,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      grantedBy: grantedByUserId,
      createdBy: grantedByUserId,
    });
    await this.userPermissionRepo.save(item);
    return { success: true, created: true };
  }

  async removeUserPermission(id: string, userId: string) {
    const item = await this.userPermissionRepo.findOne({
      where: { id, isDeleted: false },
    });
    if (!item) throw new NotFoundException('Không tìm thấy quyền user này');

    await this.userPermissionRepo.update(id, {
      isDeleted: true,
      updatedBy: userId,
    });
    return { success: true };
  }
}
