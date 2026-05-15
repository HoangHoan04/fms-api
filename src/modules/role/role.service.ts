import { enumData } from '@/common/contanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { RoleEntity } from '@/entities/users';
import { transformKeys } from '@/helpers';
import { RoleRepository } from '@/repositories/user.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
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

    return {
      data: roles,
      total,
    };
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
        rolePermissions: {
          permission: true,
        },
      },
    });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò');

    const result = transformKeys(role);

    return {
      data: result,
      message: 'Lấy thông tin vai trò thành công',
    };
  }

  async create(data: CreateRoleDto, user: UserDto) {
    const existing = await this.repo.findOne({
      where: { code: data.code },
      withDeleted: true,
    });
    if (existing) throw new Error('Mã vai trò đã tồn tại');

    const role = new RoleEntity();
    role.id = uuidv4();
    role.code = data.code;
    role.name = data.name;
    role.description = data.description;
    role.isActive = true;
    role.createdBy = user.id;
    role.createdAt = new Date();

    await this.repo.save(role);

    const actionLogDto: ActionLogCreateDto = {
      functionId: role.id,
      functionType: 'ROLE',
      type: enumData.ActionLogType.CREATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      description: `Tạo mới vai trò: ${role.code}`,
      oldData: '{}',
      newData: JSON.stringify(role),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới vai trò thành công',
    };
  }

  async update(updateDto: UpdateRoleDto, user: UserDto) {
    const role = await this.repo.findOne({ where: { id: updateDto.id } });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò');

    if (updateDto.code && updateDto.code !== role.code) {
      const existing = await this.repo.findOne({
        where: { code: updateDto.code },
        withDeleted: true,
      });
      if (existing) throw new Error('Mã vai trò đã tồn tại');
    }

    const updateRole = {
      code: updateDto.code,
      name: updateDto.name,
      description: updateDto.description,
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    await this.repo.update(role.id, updateRole);

    const actionLogDto: ActionLogCreateDto = {
      functionId: role.id,
      functionType: 'ROLE',
      type: enumData.ActionLogType.UPDATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      description: `Cập nhật vai trò: ${role.code}`,
      oldData: JSON.stringify(role),
      newData: JSON.stringify(updateRole),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật vai trò thành công',
    };
  }

  async deactivate(user: UserDto, id: string) {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Không tìm thấy vai trò');
    }

    await this.repo.update(id, {
      isActive: false,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: role.id,
      functionType: 'ROLE',
      type: enumData.ActionLogType.DEACTIVATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      description: `Ngừng hoạt động vai trò với code: ${role.code}`,
      oldData: JSON.stringify(role),
      newData: JSON.stringify({
        ...role,
        isActive: false,
      }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Ngừng hoạt động vai trò thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Không tìm thấy vai trò');
    }

    await this.repo.update(id, {
      isActive: true,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: role.id,
      functionType: 'ROLE',
      type: enumData.ActionLogType.ACTIVATE.code,
      createdById: user.id,
      createdByCode: user.code,
      createdByName: user.username,
      description: `Kích hoạt vai trò với code: ${role.code}`,
      oldData: JSON.stringify(role),
      newData: JSON.stringify({
        ...role,
        isActive: true,
      }),
    };

    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Kích hoạt vai trò thành công',
    };
  }
}
