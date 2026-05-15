import { PaginationDto } from '@/dto';
import { ActionLogEntity } from '@/entities';
import { transformKeys } from '@/helpers';
import { ActionLogRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogCreateDto } from './dto';

@Injectable()
export class ActionLogService {
  constructor(private repo: ActionLogRepository) {}

  async create(dto: ActionLogCreateDto): Promise<void> {
    const actionLog = new ActionLogEntity();
    actionLog.id = uuidv4();
    actionLog.actionType = dto.actionType;
    actionLog.entityName = dto.entityName;
    actionLog.entityId = dto.entityId;
    actionLog.createdById = dto.createdById;
    actionLog.createdByCode = dto.createdByCode;
    actionLog.createdByName = dto.createdByName;
    actionLog.createdNote = dto.createdNote;
    actionLog.oldValue = dto.oldValue;
    actionLog.newValue = dto.newValue;
    actionLog.ipAddress = dto.ipAddress;
    actionLog.userAgent = dto.userAgent;
    actionLog.createdAt = new Date();
    actionLog.createdBy = dto.createdById;
    await this.repo.save(actionLog);
  }

  async createList(dtos: ActionLogCreateDto[]): Promise<void> {
    const entities = dtos.map((dto) => {
      const actionLog = new ActionLogEntity();
      actionLog.id = uuidv4();
      actionLog.actionType = dto.actionType;
      actionLog.entityName = dto.entityName;
      actionLog.entityId = dto.entityId;
      actionLog.createdById = dto.createdById;
      actionLog.createdByCode = dto.createdByCode;
      actionLog.createdByName = dto.createdByName;
      actionLog.createdNote = dto.createdNote;
      actionLog.oldValue = dto.oldValue;
      actionLog.newValue = dto.newValue;
      actionLog.ipAddress = dto.ipAddress;
      actionLog.userAgent = dto.userAgent;
      actionLog.createdAt = new Date();
      actionLog.createdBy = dto.createdById;
      return actionLog;
    });
    await this.repo.save(entities);
  }

  async findById(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) throw new NotFoundException('Không tìm thấy log');
    return { message: 'Tìm kiếm thành công', data: result };
  }

  async pagination(data: PaginationDto) {
    const { skip = 0, take = 10, where } = data;
    const whereCon: FindOptionsWhere<ActionLogEntity> = {};

    if (where?.entityName) whereCon.entityName = where.entityName;
    if (where?.entityId) whereCon.entityId = where.entityId;
    if (where?.actionType) whereCon.actionType = where.actionType;
    if (where?.createdById) whereCon.createdById = where.createdById;

    const [items, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
    const result = transformKeys(items);

    return { data: result, total };
  }
}
