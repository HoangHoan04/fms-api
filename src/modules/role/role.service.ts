import { coreHelper, transformKeys } from '@/helpers';
import { enumData } from '@/common/contanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { RoleEntity } from '@/entities/users';
import { RoleRepository } from '@/repositories/user.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../action-log/action-log.service';
import { ActionLogCreateDto } from '../action-log/dto';
import { CreateRoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly repo: RoleRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<RoleEntity> = {};

    if (data.where.code) whereCon.code = ILike(`%${data.where.code}%`);
    if (data.where.name) whereCon.name = ILike(`%${data.where.name}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [roles, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return { data: roles, total };
  }

  async selectbox() {
    return await this.repo.find({
      where: { isDeleted: false },
      select: { id: true, name: true, code: true },
      order: { name: 'ASC' },
    });
  }

  async findById(data: IdDto) {
    const role = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
      relations: {
        rolePermissions: { permission: true },
        userRoles: true,
      },
    });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò');

    return {
      data: transformKeys({
        ...role,
        totalPermissions: role.rolePermissions?.length || 0,
        totalUsers: role.userRoles?.length || 0,
      }),
      message: 'Lấy thông tin vai trò thành công',
    };
  }

  async create(data: CreateRoleDto, user: UserDto) {
    const existing = await this.repo.findOne({
      where: { code: data.code },
      withDeleted: true,
    });
    if (existing) {
      throw new BadRequestException('Mã vai trò đã tồn tại');
    }

    const role = new RoleEntity();
    role.id = uuidv4();
    role.code = data.code;
    role.name = data.name;
    role.description = data.description;
    role.isActive = true;
    role.createdBy = user.id;
    role.createdAt = coreHelper.newDateTZ();

    await this.repo.save(role);

    const actionLogDto: ActionLogCreateDto = {
      entityId: role.id,
      entityName: 'ROLE',
      actionType: enumData.ActionLogType.CREATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `Tạo mới vai trò: ${role.code}`,
      oldValue: '{}',
      newValue: JSON.stringify(role),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Tạo mới vai trò thành công' };
  }

  async update(updateDto: UpdateRoleDto, user: UserDto) {
    const role = await this.repo.findOne({ where: { id: updateDto.id } });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò');

    if (updateDto.code && updateDto.code !== role.code) {
      const existing = await this.repo.findOne({
        where: { code: updateDto.code },
        withDeleted: true,
      });
      if (existing) {
        throw new BadRequestException('Mã vai trò đã tồn tại');
      }
    }

    const updateData = {
      code: updateDto.code,
      name: updateDto.name,
      createdNote: updateDto.description,
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
    };

    await this.repo.update(role.id, updateData);

    const updatedRole = await this.repo.findOne({
      where: { id: role.id },
      relations: { rolePermissions: { permission: true } },
    });

    const actionLogDto: ActionLogCreateDto = {
      entityId: role.id,
      entityName: 'ROLE',
      actionType: enumData.ActionLogType.UPDATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `Cập nhật vai trò: ${role.code}`,
      oldValue: JSON.stringify(role),
      newValue: JSON.stringify(updateData),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật vai trò thành công',
      data: transformKeys(updatedRole),
    };
  }

  async deactivate(user: UserDto, id: string) {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò');

    await this.repo.update(id, {
      isActive: false,
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
    });

    const actionLogDto: ActionLogCreateDto = {
      entityId: role.id,
      entityName: 'ROLE',
      actionType: enumData.ActionLogType.DEACTIVATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `Ngừng hoạt động vai trò: ${role.code}`,
      oldValue: JSON.stringify(role),
      newValue: JSON.stringify({ ...role, isActive: false }),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Ngừng hoạt động vai trò thành công' };
  }

  async activate(user: UserDto, id: string) {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò');

    await this.repo.update(id, {
      isActive: true,
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
    });

    const actionLogDto: ActionLogCreateDto = {
      entityId: role.id,
      entityName: 'ROLE',
      actionType: enumData.ActionLogType.ACTIVATE.code,
      createdById: user.id,
      createdByCode: user.code,
      createdByName: user.username,
      createdNote: `Kích hoạt vai trò: ${role.code}`,
      oldValue: JSON.stringify(role),
      newValue: JSON.stringify({ ...role, isActive: true }),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Kích hoạt vai trò thành công' };
  }
}
