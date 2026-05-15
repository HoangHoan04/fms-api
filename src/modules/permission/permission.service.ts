import { coreHelper, transformKeys } from '@/helpers';
import { enumData } from '@/common/contanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { PermissionEntity } from '@/entities/users';
import {
  PermissionRepository,
  RolePermissionRepository,
  UserPermissionRepository,
} from '@/repositories/user.repository';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../action-log/action-log.service';
import { ActionLogCreateDto } from '../action-log/dto';
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
    private readonly actionLogService: ActionLogService,
  ) {}

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<PermissionEntity> = {};
    const filter = data.where;

    if (filter?.code) whereCon.code = ILike(`%${filter.code}%`);
    if (filter?.name) whereCon.name = ILike(`%${filter.name}%`);
    if (filter?.module) whereCon.module = ILike(`%${filter.module}%`);
    if (filter && [true, false].includes(filter.isDeleted as boolean))
      whereCon.isDeleted = filter.isDeleted;

    const [items, total] = await this.permissionRepo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { module: 'ASC', code: 'ASC' },
    });

    return { data: items, total };
  }

  async selectbox() {
    return await this.permissionRepo.find({
      where: { isDeleted: false },
      select: { id: true, code: true, name: true, module: true, action: true },
      order: { module: 'ASC', code: 'ASC' },
    });
  }

  async findById(data: IdDto) {
    const permission = await this.permissionRepo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!permission) throw new NotFoundException('Không tìm thấy quyền hạn');

    return {
      data: transformKeys(permission),
      message: 'Tìm kiếm quyền hạn thành công',
    };
  }

  async create(data: CreatePermissionDto, user: UserDto) {
    const existing = await this.permissionRepo.findOne({
      where: { code: data.code },
      withDeleted: true,
    });
    if (existing) {
      throw new ConflictException('Mã quyền đã tồn tại');
    }

    const permission = this.permissionRepo.create({
      id: uuidv4(),
      code: data.code,
      name: data.name,
      description: data.description,
      module: data.module,
      action: data.action,
      createdBy: user.id,
      createdAt: coreHelper.newDateTZ(),
    });
    await this.permissionRepo.save(permission);

    const actionLogDto: ActionLogCreateDto = {
      entityId: permission.id,
      entityName: 'PERMISSION',
      actionType: enumData.ActionLogType.CREATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} tạo mới quyền: ${permission.code}`,
      oldValue: '{}',
      newValue: JSON.stringify(permission),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Tạo mới quyền thành công', data: permission };
  }

  async update(data: UpdatePermissionDto, user: UserDto) {
    const existing = await this.permissionRepo.findOne({
      where: { id: data.id },
    });
    if (!existing) throw new NotFoundException('Không tìm thấy quyền hạn');

    if (data.code && data.code !== existing.code) {
      const duplicate = await this.permissionRepo.findOne({
        where: { code: data.code },
        withDeleted: true,
      });
      if (duplicate) throw new ConflictException('Mã quyền đã tồn tại');
    }

    const updateData: any = {
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
    };
    if (data.code !== undefined) updateData.code = data.code;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.module !== undefined) updateData.module = data.module;
    if (data.action !== undefined) updateData.action = data.action;

    await this.permissionRepo.update(data.id, updateData);

    const updated = await this.permissionRepo.findOne({
      where: { id: data.id },
    });

    const actionLogDto: ActionLogCreateDto = {
      entityId: existing.id,
      entityName: 'PERMISSION',
      actionType: enumData.ActionLogType.UPDATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} cập nhật quyền: ${existing.code}`,
      oldValue: JSON.stringify(existing),
      newValue: JSON.stringify(updated),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật quyền thành công',
      data: transformKeys(updated),
    };
  }

  async deactivate(id: string, user: UserDto) {
    const permission = await this.permissionRepo.findOne({ where: { id } });
    if (!permission) throw new NotFoundException('Không tìm thấy quyền hạn');

    await this.permissionRepo.update(id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
    });

    const actionLogDto: ActionLogCreateDto = {
      entityId: permission.id,
      entityName: 'PERMISSION',
      actionType: enumData.ActionLogType.DEACTIVATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} ngừng hoạt động quyền: ${permission.code}`,
      oldValue: JSON.stringify(permission),
      newValue: JSON.stringify({ ...permission, isDeleted: true }),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Ngừng hoạt động quyền thành công' };
  }

  async activate(id: string, user: UserDto) {
    const permission = await this.permissionRepo.findOne({ where: { id } });
    if (!permission) throw new NotFoundException('Không tìm thấy quyền hạn');

    await this.permissionRepo.update(id, {
      isDeleted: false,
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
    });

    const actionLogDto: ActionLogCreateDto = {
      entityId: permission.id,
      entityName: 'PERMISSION',
      actionType: enumData.ActionLogType.ACTIVATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} kích hoạt quyền: ${permission.code}`,
      oldValue: JSON.stringify(permission),
      newValue: JSON.stringify({ ...permission, isDeleted: false }),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Kích hoạt quyền thành công' };
  }

  async getPermissionsByRole(roleId: string) {
    return await this.rolePermissionRepo.find({
      where: { roleId, isDeleted: false },
      relations: { permission: true },
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
    user: UserDto,
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

    const items = newPermIds.map((permissionId) => {
      const rp = new (this.rolePermissionRepo.target as any)();
      rp.id = uuidv4();
      rp.roleId = roleId;
      rp.permissionId = permissionId;
      rp.createdBy = user.id;
      rp.createdAt = coreHelper.newDateTZ();
      return rp;
    });

    await this.rolePermissionRepo.save(items);

    const actionLogDto: ActionLogCreateDto = {
      entityId: roleId,
      entityName: 'ROLE_PERMISSION',
      actionType: enumData.ActionLogType.UPDATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} gán ${newPermIds.length} quyền cho role ${roleId}`,
      oldValue: JSON.stringify(existingPermIds),
      newValue: JSON.stringify([...existingPermIds, ...newPermIds]),
    };
    await this.actionLogService.create(actionLogDto);

    return { success: true, assigned: newPermIds.length };
  }

  async removePermissionFromRole(
    data: RemovePermissionFromRoleDto,
    user: UserDto,
  ) {
    const { roleId, permissionId } = data;
    const item = await this.rolePermissionRepo.findOne({
      where: { roleId, permissionId, isDeleted: false },
    });
    if (!item)
      throw new NotFoundException('Không tìm thấy quyền trong Role này');

    await this.rolePermissionRepo.update(item.id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
    });

    const actionLogDto: ActionLogCreateDto = {
      entityId: item.id,
      entityName: 'ROLE_PERMISSION',
      actionType: enumData.ActionLogType.DELETE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} xóa quyền ${permissionId} khỏi role ${roleId}`,
      oldValue: JSON.stringify(item),
      newValue: JSON.stringify({ ...item, isDeleted: true }),
    };
    await this.actionLogService.create(actionLogDto);

    return { success: true };
  }

  async getPermissionsByUser(userId: string) {
    return await this.userPermissionRepo.find({
      where: { userId, isDeleted: false },
      relations: { permission: true },
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
    grantedByUser: UserDto,
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
        grantedBy: grantedByUser.id,
        updatedBy: grantedByUser.id,
        updatedAt: coreHelper.newDateTZ(),
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
      grantedBy: grantedByUser.id,
      createdBy: grantedByUser.id,
      createdAt: coreHelper.newDateTZ(),
    });
    await this.userPermissionRepo.save(item);

    return { success: true, created: true };
  }

  async removeUserPermission(id: string, user: UserDto) {
    const item = await this.userPermissionRepo.findOne({
      where: { id, isDeleted: false },
    });
    if (!item) throw new NotFoundException('Không tìm thấy quyền user này');

    await this.userPermissionRepo.update(id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
    });

    return { success: true };
  }
}
