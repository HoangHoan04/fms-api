import { PaginationDto } from '@/dto';
import { LoginLogEntity } from '@/entities';
import { LoginLogRepository } from '@/repositories';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class LoginLogService {
  constructor(private readonly repo: LoginLogRepository) {}

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<LoginLogEntity> = {};
    if (data.where?.userId) whereCon.userId = data.where.userId;
    if (data.where?.actorType) whereCon.actorType = data.where.actorType;
    if (data.where?.status) whereCon.status = data.where.status;
    if (data.where?.loginProvider)
      whereCon.loginProvider = data.where.loginProvider;

    const [items, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { loggedInAt: 'DESC' },
      relations: { user: true },
    });
    return { data: items, total };
  }
}
