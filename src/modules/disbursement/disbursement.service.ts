import { enumData } from '@/common/contanst/enumData';
import { coreHelper } from '@/helpers';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { DisbursementEntity, DisbursementConfirmationEntity } from '@/entities';
import {
  DisbursementRepository,
  DisbursementConfirmationRepository,
} from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../action-log/action-log.service';
import { ActionLogCreateDto } from '../action-log/dto';
import { ConfirmDisbursementDto, CreateDisbursementDto } from './dto';

@Injectable()
export class DisbursementService {
  constructor(
    private readonly repo: DisbursementRepository,
    private readonly confirmationRepo: DisbursementConfirmationRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async findById(data: IdDto) {
    const result = await this.repo.findOne({
      where: { id: data.id },
      relations: {
        receipt: true,
        cycle: true,
        disburser: true,
        proofFile: true,
        confirmations: true,
      },
    });
    if (!result) throw new NotFoundException('Không tìm thấy phiếu giải ngân');
    return { message: 'Tìm kiếm thành công', data: result };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<DisbursementEntity> = {};
    if (data.where?.cycleId) whereCon.cycleId = data.where.cycleId;
    if (data.where?.receiptId) whereCon.receiptId = data.where.receiptId;
    if (data.where?.paymentMethod)
      whereCon.paymentMethod = data.where.paymentMethod;

    const [items, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: { receipt: true, cycle: true, disburser: true },
    });
    return { data: items, total };
  }

  async create(user: UserDto, dto: CreateDisbursementDto) {
    const disbursement = new DisbursementEntity();
    disbursement.id = uuidv4();
    disbursement.receiptId = dto.receiptId;
    disbursement.cycleId = dto.cycleId;
    disbursement.amount = dto.amount;
    disbursement.paymentMethod = dto.paymentMethod;
    disbursement.transactionRef = dto.transactionRef;
    disbursement.proofFileId = dto.proofFileId;
    disbursement.bankName = dto.bankName;
    disbursement.bankAccountNo = dto.bankAccountNo;
    disbursement.bankAccountName = dto.bankAccountName;
    disbursement.note = dto.note;
    disbursement.disbursedBy = user.employeeId || user.id;
    disbursement.disbursedAt = new Date();
    disbursement.createdBy = user.id;
    disbursement.createdAt = coreHelper.newDateTZ();
    await this.repo.save(disbursement);

    const actionLogDto: ActionLogCreateDto = {
      entityId: disbursement.id,
      entityName: 'DISBURSEMENT',
      actionType: enumData.ActionLogType.CREATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} tạo phiếu giải ngân`,
      oldValue: '{}',
      newValue: JSON.stringify(disbursement),
    };
    await this.actionLogService.create(actionLogDto);
    return { message: 'Tạo phiếu giải ngân thành công' };
  }

  async confirm(user: UserDto, dto: ConfirmDisbursementDto) {
    const disbursement = await this.repo.findOne({ where: { id: dto.id } });
    if (!disbursement)
      throw new NotFoundException('Không tìm thấy phiếu giải ngân');

    const confirmation = new DisbursementConfirmationEntity();
    confirmation.id = uuidv4();
    confirmation.disbursementId = disbursement.id;
    confirmation.confirmedBy = user.memberId || user.id;
    confirmation.confirmedAt = new Date();
    confirmation.proofFileId = dto.proofFileId;
    confirmation.note = dto.note;
    await this.confirmationRepo.save(confirmation);

    return { message: 'Xác nhận giải ngân thành công' };
  }

  async getConfirmations(disbursementId: string) {
    const confirmations = await this.confirmationRepo.find({
      where: { disbursementId, isDeleted: false },
      relations: { confirmer: true },
      order: { confirmedAt: 'DESC' },
    });
    return { data: confirmations };
  }
}
