import { PaginationDto } from '@/dto';
import { SystemConfigRepository } from '@/repositories';
import { Injectable } from '@nestjs/common';
import { CreateSystemConfigDto, UpdateSystemConfigDto } from './dto';

@Injectable()
export class SystemConfigService {
  constructor(private readonly repo: SystemConfigRepository) {}

  async findById(id: string) {}

  async pagination(data: PaginationDto) {}

  async selectbox() {}

  async create(dto: CreateSystemConfigDto) {}

  async update(dto: UpdateSystemConfigDto) {}
}
