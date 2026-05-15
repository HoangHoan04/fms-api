import { enumData } from '@/common/contanst/enumData';
import { coreHelper } from '@/helpers';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { ContributionEntity, ContributionReminderEntity } from '@/entities';
import {
  ContributionRepository,
  ContributionReminderRepository,
  FundCycleRepository,
} from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../action-log/action-log.service';
import { ActionLogCreateDto } from '../action-log/dto';
import {
  ConfirmContributionDto,
  CreateContributionDto,
  UpdateContributionDto,
} from './dto';

@Injectable()
export class ContributionService {
  constructor(
    private readonly repo: ContributionRepository,
    private readonly reminderRepo: ContributionReminderRepository,
    private readonly fundCycleRepo: FundCycleRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async findById(data: IdDto) {
    const result = await this.repo.findOne({
      where: { id: data.id },
      relations: {
        cycle: true,
        fundMember: { member: true },
        confirmer: true,
      },
    });
    if (!result) throw new NotFoundException('Không tìm thấy khoản đóng');
    return { message: 'Tìm kiếm thành công', data: result };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<ContributionEntity> = {};
    if (data.where?.cycleId) whereCon.cycleId = data.where.cycleId;
    if (data.where?.fundMemberId)
      whereCon.fundMemberId = data.where.fundMemberId;
    if (data.where?.status) whereCon.status = data.where.status;
    if (data.where?.isLate !== undefined) whereCon.isLate = data.where.isLate;

    const [items, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: { cycle: true, fundMember: { member: true } },
    });
    return { data: items, total };
  }

  async selectbox() {
    return await this.repo.find({
      where: { isDeleted: false },
      select: { id: true, cycleId: true, fundMemberId: true, amount: true, status: true },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async create(user: UserDto, dto: CreateContributionDto) {
    const contribution = new ContributionEntity();
    contribution.id = uuidv4();
    contribution.cycleId = dto.cycleId;
    contribution.fundMemberId = dto.fundMemberId;
    contribution.amount = dto.amount;
    contribution.requiredAmount = dto.requiredAmount;
    contribution.dueDate = dto.dueDate;
    contribution.paymentMethod = dto.paymentMethod;
    contribution.transactionRef = dto.transactionRef;
    contribution.proofFileId = dto.proofFileId;
    contribution.note = dto.note;
    contribution.status = 'pending';
    contribution.createdBy = user.id;
    contribution.createdAt = coreHelper.newDateTZ();
    await this.repo.save(contribution);
    return { message: 'Tạo khoản đóng thành công' };
  }

  async update(user: UserDto, dto: UpdateContributionDto) {
    const contribution = await this.repo.findOne({ where: { id: dto.id } });
    if (!contribution) throw new NotFoundException('Không tìm thấy khoản đóng');

    const oldData = { ...contribution };
    const { id, ...rest } = dto;
    Object.assign(contribution, rest, {
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
    });
    await this.repo.save(contribution);

    const actionLogDto: ActionLogCreateDto = {
      entityId: contribution.id,
      entityName: 'CONTRIBUTION',
      actionType: enumData.ActionLogType.UPDATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} cập nhật khoản đóng`,
      oldValue: JSON.stringify(oldData),
      newValue: JSON.stringify(contribution),
    };
    await this.actionLogService.create(actionLogDto);
    return { message: 'Cập nhật khoản đóng thành công' };
  }

  async confirm(user: UserDto, dto: ConfirmContributionDto) {
    const contribution = await this.repo.findOne({
      where: { id: dto.id },
      relations: { cycle: true },
    });
    if (!contribution) throw new NotFoundException('Không tìm thấy khoản đóng');
    if (contribution.status === 'paid')
      throw new NotFoundException('Khoản đóng này đã được xác nhận trước đó');

    const oldData = { ...contribution };
    contribution.status = 'paid';
    contribution.paidAt = new Date();
    contribution.confirmedBy = user.employeeId || user.id;
    contribution.amount = dto.amount ?? contribution.amount;
    contribution.paymentMethod =
      dto.paymentMethod || contribution.paymentMethod;
    contribution.transactionRef =
      dto.transactionRef || contribution.transactionRef;
    contribution.note = dto.note || contribution.note;
    contribution.updatedBy = user.id;
    contribution.updatedAt = coreHelper.newDateTZ();
    await this.repo.save(contribution);

    // Update cycle totalCollected
    const cycle = contribution.cycle;
    if (cycle) {
      const paidContributions = await this.repo.find({
        where: { cycleId: cycle.id, status: 'paid', isDeleted: false },
      });
      const newTotal = paidContributions.reduce(
        (sum, c) => sum + Number(c.amount),
        0,
      );
      await this.fundCycleRepo.update(cycle.id, {
        totalCollected: newTotal,
        updatedBy: user.id,
        updatedAt: coreHelper.newDateTZ(),
      });
    }

    const actionLogDto: ActionLogCreateDto = {
      entityId: contribution.id,
      entityName: 'CONTRIBUTION',
      actionType: enumData.ActionLogType.UPDATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} xác nhận đóng tiền`,
      oldValue: JSON.stringify(oldData),
      newValue: JSON.stringify(contribution),
    };
    await this.actionLogService.create(actionLogDto);
    return { message: 'Xác nhận đóng tiền thành công' };
  }

  async delete(user: UserDto, id: string) {
    const contribution = await this.repo.findOne({ where: { id } });
    if (!contribution) throw new NotFoundException('Không tìm thấy khoản đóng');
    await this.repo.update(id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
    });
    return { message: 'Xóa khoản đóng thành công' };
  }

  async getReminders(contributionId: string) {
    const reminders = await this.reminderRepo.find({
      where: { contributionId, isDeleted: false },
      order: { reminderDate: 'DESC' },
    });
    return { data: reminders };
  }
}
