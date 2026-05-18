import { IdDto, PaginationDto, UserDto } from '@/dto';
import { RoleRepository } from '@/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { ActionLogService } from '../action-log/action-log.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly repo: RoleRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async pagination(data: PaginationDto) {}

  async selectbox() {}

  async findById(data: IdDto) {}

  async create(data: CreateRoleDto, user: UserDto) {}

  async update(updateDto: UpdateRoleDto, user: UserDto) {}

  async deactivate(user: UserDto, id: string) {}

  async activate(user: UserDto, id: string) {}
}
