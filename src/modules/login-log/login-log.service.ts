import { IdDto, PaginationDto } from '@/dto';
import { LoginLogEntity } from '@/entities';
import { transformKeys } from '@/helpers/objectHelper';
import { LoginLogRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateLoginLogDto,
  CreateManyLoginLogDto,
  UpdateLoginLogDto,
} from './dto';

@Injectable()
export class LoginLogService {
  constructor(private repo: LoginLogRepository) {}

  async create(dto: CreateLoginLogDto): Promise<void> {
    const loginLog = new LoginLogEntity();
    loginLog.id = uuidv4();
    loginLog.userId = dto.userId;
    loginLog.status = dto.status;
    loginLog.failReason = dto.failReason;
    loginLog.ipAddress = dto.ipAddress;
    loginLog.userAgent = dto.userAgent;
    loginLog.deviceType = dto.deviceType;
    loginLog.loggedInAt = dto.loggedInAt || new Date();
    loginLog.createdAt = new Date();
    loginLog.createdBy = dto.userId;
    await this.repo.save(loginLog);
  }

  async createMany(dto: CreateManyLoginLogDto): Promise<void> {
    const entities = dto.logs.map((log) => {
      const loginLog = new LoginLogEntity();
      loginLog.id = uuidv4();
      loginLog.userId = log.userId;
      loginLog.status = log.status;
      loginLog.failReason = log.failReason;
      loginLog.ipAddress = log.ipAddress;
      loginLog.userAgent = log.userAgent;
      loginLog.deviceType = log.deviceType;
      loginLog.loggedInAt = log.loggedInAt || new Date();
      loginLog.createdAt = new Date();
      loginLog.createdBy = log.userId;
      return loginLog;
    });
    await this.repo.save(entities);
  }

  async findById(data: IdDto) {
    const result = await this.repo.findOne({
      where: { id: data.id },
      relations: { user: true },
    });
    if (!result)
      throw new NotFoundException('Không tìm thấy lịch sử đăng nhập');
    return { message: 'Tìm kiếm thành công', data: result };
  }

  async pagination(data: PaginationDto) {
    const { skip = 0, take = 10, where } = data;
    const whereCon: FindOptionsWhere<LoginLogEntity> = {};

    if (where?.userId) whereCon.userId = where.userId;
    if (where?.status) whereCon.status = where.status;
    if (where?.failReason) whereCon.failReason = where.failReason;
    if (where?.deviceType) whereCon.deviceType = where.deviceType;
    if ([true, false].includes(where?.isDeleted))
      whereCon.isDeleted = where.isDeleted;

    const [items, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { loggedInAt: 'DESC' },
      relations: { user: true },
    });
    const result = transformKeys(items);

    return { data: result, total };
  }

  async update(data: IdDto, dto: UpdateLoginLogDto) {
    const loginLog = await this.repo.findOne({ where: { id: data.id } });
    if (!loginLog)
      throw new NotFoundException('Không tìm thấy lịch sử đăng nhập');

    if (dto.status) loginLog.status = dto.status;
    if (dto.failReason) loginLog.failReason = dto.failReason;
    if (dto.ipAddress) loginLog.ipAddress = dto.ipAddress;
    if (dto.userAgent) loginLog.userAgent = dto.userAgent;
    if (dto.deviceType) loginLog.deviceType = dto.deviceType;
    if (dto.loggedInAt) loginLog.loggedInAt = dto.loggedInAt;
    loginLog.updatedAt = new Date();
    loginLog.updatedBy = 'system';

    await this.repo.save(loginLog);
    return { message: 'Cập nhật thành công', data: loginLog };
  }

  async remove(data: IdDto): Promise<void> {
    const loginLog = await this.repo.findOne({ where: { id: data.id } });
    if (!loginLog)
      throw new NotFoundException('Không tìm thấy lịch sử đăng nhập');

    await this.repo.delete({ id: data.id });
  }

  async removeByFk(fkField: string, fkValue: string): Promise<void> {
    await this.repo.delete({ [fkField]: fkValue });
  }
}
