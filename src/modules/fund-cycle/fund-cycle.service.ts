import { enumData } from '@/common/contanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { ContributionEntity, FundCycleEntity } from '@/entities';
import { coreHelper, transformKeys } from '@/helpers';
import {
  ContributionRepository,
  FundCycleRepository,
  FundMemberRepository,
} from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../action-log/action-log.service';
import { ActionLogCreateDto } from '../action-log/dto';
import { CreateFundCycleDto, UpdateFundCycleDto } from './dto';

@Injectable()
export class FundCycleService {
  constructor(
    private readonly repo: FundCycleRepository,
    private readonly fundMemberRepo: FundMemberRepository,
    private readonly contributionRepo: ContributionRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  private genCode(): string {
    const generate = customAlphabet('0123456789', 5);
    return `CYCLE-${generate()}`;
  }

  async findById(data: IdDto) {
    const result = await this.repo.findOne({
      where: { id: data.id },
      relations: {
        fund: true,
        contributions: { fundMember: { member: true } },
      },
    });
    if (!result) throw new NotFoundException('Không tìm thấy chu kỳ');
    return {
      message: 'Tìm kiếm chu kỳ thành công',
      data: transformKeys(result),
    };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<FundCycleEntity> = {};
    if (data.where?.fundId) whereCon.fundId = data.where.fundId;
    if (data.where?.status) whereCon.status = data.where.status;
    if ([true, false].includes(data.where?.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [items, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { cycleIndex: 'DESC', createdAt: 'DESC' },
      relations: { fund: true },
    });
    return { data: items, total };
  }

  async selectbox() {
    return await this.repo.find({
      where: { isDeleted: false },
      select: { id: true, code: true, name: true, fundId: true },
      order: { createdAt: 'DESC' },
    });
  }

  async create(user: UserDto, dto: CreateFundCycleDto) {
    const cycle = new FundCycleEntity();
    cycle.id = uuidv4();
    cycle.code = this.genCode();
    cycle.fundId = dto.fundId;
    cycle.cycleIndex = dto.cycleIndex;
    cycle.name = dto.name;
    cycle.startDate = dto.startDate;
    cycle.endDate = dto.endDate;
    cycle.payoutDate = dto.payoutDate;
    cycle.contributionAmount = dto.contributionAmount;
    cycle.totalExpected = dto.totalExpected;
    cycle.note = dto.note;
    cycle.status = 'open';
    cycle.createdBy = user.id;
    cycle.createdAt = coreHelper.newDateTZ();
    await this.repo.save(cycle);

    const activeMembers = await this.fundMemberRepo.find({
      where: { fundId: dto.fundId, isDeleted: false },
    });

    if (activeMembers.length > 0) {
      const contributions = activeMembers.map((fm) => {
        const c = new ContributionEntity();
        c.id = uuidv4();
        c.cycleId = cycle.id;
        c.fundMemberId = fm.id;
        c.requiredAmount = dto.contributionAmount;
        c.amount = 0;
        c.dueDate = dto.endDate;
        c.status = 'pending';
        c.createdBy = user.id;
        c.createdAt = coreHelper.newDateTZ();
        return c;
      });
      await this.contributionRepo.save(contributions);
    }

    const actionLogDto: ActionLogCreateDto = {
      entityId: cycle.id,
      entityName: 'FUND_CYCLE',
      actionType: enumData.ActionLogType.CREATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} tạo chu kỳ: ${cycle.code}`,
      oldValue: '{}',
      newValue: JSON.stringify(cycle),
    };
    await this.actionLogService.create(actionLogDto);
    return { message: 'Tạo chu kỳ và danh sách đóng tiền thành công' };
  }

  async update(user: UserDto, dto: UpdateFundCycleDto) {
    const cycle = await this.repo.findOne({ where: { id: dto.id } });
    if (!cycle) throw new NotFoundException('Không tìm thấy chu kỳ');

    const oldData = { ...cycle };
    const { id, ...rest } = dto;
    Object.assign(cycle, rest, {
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
    });
    await this.repo.save(cycle);

    const actionLogDto: ActionLogCreateDto = {
      entityId: cycle.id,
      entityName: 'FUND_CYCLE',
      actionType: enumData.ActionLogType.UPDATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} cập nhật chu kỳ: ${cycle.code}`,
      oldValue: JSON.stringify(oldData),
      newValue: JSON.stringify(cycle),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Cập nhật chu kỳ thành công',
      data: transformKeys(cycle),
    };
  }

  async close(user: UserDto, id: string) {
    const cycle = await this.repo.findOne({ where: { id } });
    if (!cycle) throw new NotFoundException('Không tìm thấy chu kỳ');

    const oldData = { ...cycle };
    cycle.status = 'closed';
    cycle.updatedBy = user.id;
    cycle.updatedAt = coreHelper.newDateTZ();
    await this.repo.save(cycle);

    const actionLogDto: ActionLogCreateDto = {
      entityId: cycle.id,
      entityName: 'FUND_CYCLE',
      actionType: enumData.ActionLogType.UPDATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} đóng chu kỳ: ${cycle.code}`,
      oldValue: JSON.stringify(oldData),
      newValue: JSON.stringify(cycle),
    };
    await this.actionLogService.create(actionLogDto);
    return { message: 'Đóng chu kỳ thành công' };
  }

  async delete(user: UserDto, id: string) {
    const cycle = await this.repo.findOne({ where: { id } });
    if (!cycle) throw new NotFoundException('Không tìm thấy chu kỳ');
    await this.repo.update(id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
    });

    const actionLogDto: ActionLogCreateDto = {
      entityId: cycle.id,
      entityName: 'FUND_CYCLE',
      actionType: enumData.ActionLogType.DELETE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} xóa chu kỳ: ${cycle.code}`,
      oldValue: JSON.stringify(cycle),
      newValue: JSON.stringify({ ...cycle, isDeleted: true }),
    };
    await this.actionLogService.create(actionLogDto);
    return { message: 'Xóa chu kỳ thành công' };
  }
}
