import { enumData } from '@/common/contanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { FundEntity, FundMemberEntity } from '@/entities';
import { coreHelper, transformKeys } from '@/helpers';
import { FundMemberRepository, FundRepository } from '@/repositories';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../action-log/action-log.service';
import { ActionLogCreateDto } from '../action-log/dto';
import { CreateFundMemberDto } from './dto/fund-member.dto';
import { CreateFundDto, UpdateFundDto } from './dto/fund.dto';

@Injectable()
export class FundService {
  constructor(
    private readonly repo: FundRepository,
    private readonly fundMemberRepo: FundMemberRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  private genCodeFund(): string {
    const generate = customAlphabet('0123456789', 5);
    return `FUND-${generate()}`;
  }

  async findById(data: IdDto) {
    const result = await this.repo.findOne({
      where: { id: data.id },
      relations: {
        manager: true,
        fundMembers: { member: true },
        fundCycles: true,
      },
    });

    const finalData = transformKeys(result);

    if (!result) throw new NotFoundException('Không tìm thấy quỹ');
    return {
      message: 'Tìm kiếm quỹ thành công',
      data: finalData,
    };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<FundEntity> = {};
    if (data.where?.code) whereCon.code = ILike(`%${data.where.code}%`);
    if (data.where?.name) whereCon.name = ILike(`%${data.where.name}%`);
    if (data.where?.status) whereCon.status = data.where.status;
    if ([true, false].includes(data.where?.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [funds, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: { manager: true },
    });
    return { data: funds, total };
  }

  async selectbox() {
    return await this.repo.find({
      where: { isDeleted: false, status: 'active' },
      select: { id: true, code: true, name: true },
    });
  }

  async create(user: UserDto, createDto: CreateFundDto) {
    const fund = new FundEntity();
    fund.id = uuidv4();
    fund.code = this.genCodeFund();
    fund.name = createDto.name;
    fund.description = createDto.description;
    fund.contributionAmount = createDto.contributionAmount;
    fund.cycleType = createDto.cycleType;
    fund.cycleDurationDays = createDto.cycleDurationDays;
    fund.maxRecipientPerCycle = createDto.maxRecipientPerCycle ?? 1;
    fund.totalMembers = createDto.totalMembers;
    fund.startDate = createDto.startDate;
    fund.endDate = createDto.endDate;
    fund.managedBy = createDto.managedBy;
    fund.createdBy = user.id;
    fund.createdAt = coreHelper.newDateTZ();
    await this.repo.save(fund);

    if (createDto.fundMembers?.length) {
      const fundMembers = createDto.fundMembers.map((m) => {
        const fm = new FundMemberEntity();
        fm.id = uuidv4();
        fm.fundId = fund.id;
        fm.memberId = m.memberId;
        fm.note = m.note;
        fm.joinDate = new Date();
        fm.createdBy = user.id;
        fm.createdAt = coreHelper.newDateTZ();
        return fm;
      });
      await this.fundMemberRepo.save(fundMembers);
    }

    const actionLogDto: ActionLogCreateDto = {
      entityId: fund.id,
      entityName: 'FUND',
      actionType: enumData.ActionLogType.CREATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} tạo mới quỹ: ${fund.code}`,
      oldValue: '{}',
      newValue: JSON.stringify(fund),
    };
    await this.actionLogService.create(actionLogDto);
    return { message: 'Tạo mới quỹ thành công' };
  }

  async update(user: UserDto, updateDto: UpdateFundDto) {
    const fund = await this.repo.findOne({ where: { id: updateDto.id } });
    if (!fund) throw new NotFoundException('Không tìm thấy quỹ');

    const oldData = { ...fund };
    const { id, fundMembers, ...rest } = updateDto;
    Object.assign(fund, rest, {
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
    });
    await this.repo.save(fund);

    if (updateDto.fundMembers) {
      await this.fundMemberRepo.update(
        { fundId: fund.id, isDeleted: false },
        {
          isDeleted: true,
          leaveDate: new Date(),
          updatedBy: user.id,
          updatedAt: coreHelper.newDateTZ(),
        },
      );

      if (updateDto.fundMembers.length > 0) {
        const fundMembers = updateDto.fundMembers.map((m) => {
          const fm = new FundMemberEntity();
          fm.id = uuidv4();
          fm.fundId = fund.id;
          fm.memberId = m.memberId;
          fm.note = m.note;
          fm.joinDate = new Date();
          fm.createdBy = user.id;
          fm.createdAt = coreHelper.newDateTZ();
          return fm;
        });
        await this.fundMemberRepo.save(fundMembers);
      }
    }

    const actionLogDto: ActionLogCreateDto = {
      entityId: fund.id,
      entityName: 'FUND',
      actionType: enumData.ActionLogType.UPDATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} cập nhật quỹ: ${fund.code}`,
      oldValue: JSON.stringify(oldData),
      newValue: JSON.stringify(fund),
    };
    await this.actionLogService.create(actionLogDto);
    return { message: 'Cập nhật quỹ thành công', data: transformKeys(fund) };
  }

  async deactivate(user: UserDto, id: string) {
    const fund = await this.repo.findOne({ where: { id } });
    if (!fund) throw new NotFoundException('Không tìm thấy quỹ');
    await this.repo.update(id, {
      isDeleted: true,
      updatedAt: coreHelper.newDateTZ(),
      updatedBy: user.id,
    });
    const actionLogDto: ActionLogCreateDto = {
      entityId: fund.id,
      entityName: 'FUND',
      actionType: enumData.ActionLogType.DEACTIVATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} ngừng hoạt động quỹ: ${fund.code}`,
      oldValue: JSON.stringify(fund),
      newValue: JSON.stringify({ ...fund, isDeleted: true }),
    };
    await this.actionLogService.create(actionLogDto);
    return { message: 'Ngừng hoạt động quỹ thành công' };
  }

  async activate(user: UserDto, id: string) {
    const fund = await this.repo.findOne({ where: { id } });
    if (!fund) throw new NotFoundException('Không tìm thấy quỹ');
    await this.repo.update(id, {
      isDeleted: false,
      updatedAt: coreHelper.newDateTZ(),
      updatedBy: user.id,
    });
    const actionLogDto: ActionLogCreateDto = {
      entityId: fund.id,
      entityName: 'FUND',
      actionType: enumData.ActionLogType.ACTIVATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} kích hoạt quỹ: ${fund.code}`,
      oldValue: JSON.stringify(fund),
      newValue: JSON.stringify({ ...fund, isDeleted: false }),
    };
    await this.actionLogService.create(actionLogDto);
    return { message: 'Kích hoạt quỹ thành công' };
  }

  // ===== Fund Members =====

  async addMember(user: UserDto, dto: CreateFundMemberDto) {
    const fund = await this.repo.findOne({ where: { id: dto.fundId } });
    if (!fund) throw new NotFoundException('Không tìm thấy quỹ');

    const existing = await this.fundMemberRepo.findOne({
      where: { fundId: dto.fundId, memberId: dto.memberId, isDeleted: false },
    });
    if (existing) throw new BadRequestException('Thành viên đã tham gia quỹ');

    const fundMember = new FundMemberEntity();
    fundMember.id = uuidv4();
    fundMember.fundId = dto.fundId;
    fundMember.memberId = dto.memberId;
    fundMember.note = dto.note;
    fundMember.joinDate = new Date();
    fundMember.createdBy = user.id;
    fundMember.createdAt = coreHelper.newDateTZ();
    await this.fundMemberRepo.save(fundMember);
    return { message: 'Thêm thành viên vào quỹ thành công' };
  }

  async removeMember(user: UserDto, id: string) {
    const fundMember = await this.fundMemberRepo.findOne({ where: { id } });
    if (!fundMember)
      throw new NotFoundException('Không tìm thấy thành viên trong quỹ');
    await this.fundMemberRepo.update(id, {
      isDeleted: true,
      leaveDate: coreHelper.newDateTZ(),
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
    });
    return { message: 'Xóa thành viên khỏi quỹ thành công' };
  }

  async listMembers(fundId: string) {
    const members = await this.fundMemberRepo.find({
      where: { fundId, isDeleted: false },
      relations: { member: true },
      order: { createdAt: 'ASC' },
    });
    return { data: members };
  }
}
