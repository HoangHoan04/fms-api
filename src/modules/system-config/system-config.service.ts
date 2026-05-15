import { enumData } from '@/common/contanst/enumData';
import { PaginationDto } from '@/dto';
import { SystemConfigEntity } from '@/entities';
import { SystemConfigRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateSystemConfigDto, UpdateSystemConfigDto } from './dto';

@Injectable()
export class SystemConfigService {
  constructor(private readonly repo: SystemConfigRepository) {}

  async findById(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) throw new NotFoundException('Không tìm thấy cấu hình');
    return { message: 'Tìm kiếm thành công', data: result };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<SystemConfigEntity> = {};
    if (data.where?.key) whereCon.key = ILike(`%${data.where.key}%`);
    if (data.where?.category) whereCon.category = data.where.category;
    if (data.where?.settingTab) whereCon.settingTab = data.where.settingTab;

    const [items, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });
    return { data: items, total };
  }

  async selectbox() {
    return await this.repo.find({
      where: { isDeleted: false },
      select: { id: true, key: true, name: true },
    });
  }

  async create(dto: CreateSystemConfigDto) {
    const existing = await this.repo.findOne({ where: { key: dto.key } });
    if (existing) throw new Error('Key cấu hình đã tồn tại');

    const config = new SystemConfigEntity();
    config.id = uuidv4();
    config.key = dto.key;
    config.value = dto.value;
    config.code = dto.code || '';
    config.name = dto.name || dto.key;
    config.description = dto.description;
    config.type = dto.type || enumData.DataType.string.code;
    config.settingTab = dto.settingTab || 'SYSTEM';
    config.category = dto.category;
    config.note = dto.note || '';
    config.createdBy = 'system';
    config.createdAt = new Date();
    await this.repo.save(config);
    return { message: 'Tạo cấu hình thành công' };
  }

  async update(dto: UpdateSystemConfigDto) {
    const config = await this.repo.findOne({ where: { id: dto.id } });
    if (!config) throw new NotFoundException('Không tìm thấy cấu hình');

    config.value = dto.value;
    config.description = dto.description;
    config.note = dto.note || '';
    config.updatedBy = 'system';
    config.updatedAt = new Date();
    await this.repo.save(config);
    return { message: 'Cập nhật cấu hình thành công' };
  }
}
