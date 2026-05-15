import { enumData } from '@/common/contanst/enumData';
import { coreHelper } from '@/helpers';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { FundReceiptEntity, FundReceiptApprovalEntity } from '@/entities';
import {
  FundReceiptRepository,
  FundReceiptDocumentRepository,
  FundReceiptApprovalRepository,
} from '@/repositories';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { customAlphabet } from 'nanoid';
import { ActionLogService } from '../action-log/action-log.service';
import { ActionLogCreateDto } from '../action-log/dto';
import { ApproveReceiptDto, CreateReceiptDto, RejectReceiptDto } from './dto';

@Injectable()
export class ReceiptService {
  constructor(
    private readonly repo: FundReceiptRepository,
    private readonly documentRepo: FundReceiptDocumentRepository,
    private readonly approvalRepo: FundReceiptApprovalRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  private genCode(): string {
    const generate = customAlphabet('0123456789', 5);
    return `RCT-${generate()}`;
  }

  async findById(data: IdDto) {
    const result = await this.repo.findOne({
      where: { id: data.id },
      relations: {
        cycle: true,
        fundMember: { member: true },
        documents: true,
        approvals: { actor: true },
        reviewer: true,
      },
    });
    if (!result) throw new NotFoundException('Không tìm thấy đơn đăng ký');
    return { message: 'Tìm kiếm thành công', data: result };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<FundReceiptEntity> = {};
    if (data.where?.cycleId) whereCon.cycleId = data.where.cycleId;
    if (data.where?.fundMemberId)
      whereCon.fundMemberId = data.where.fundMemberId;
    if (data.where?.status) whereCon.status = data.where.status;

    const [items, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: { fundMember: { member: true }, cycle: true },
    });
    return { data: items, total };
  }

  async create(user: UserDto, dto: CreateReceiptDto) {
    const receipt = new FundReceiptEntity();
    receipt.id = uuidv4();
    receipt.code = this.genCode();
    receipt.cycleId = dto.cycleId;
    receipt.fundMemberId = dto.fundMemberId;
    receipt.reason = dto.reason;
    receipt.requestedAmount = dto.requestedAmount;
    receipt.priority = dto.priority ?? 0;
    receipt.bankName = dto.bankName;
    receipt.bankAccountNo = dto.bankAccountNo;
    receipt.bankAccountName = dto.bankAccountName;
    receipt.status = 'pending';
    receipt.submittedAt = new Date();
    receipt.createdBy = user.id;
    receipt.createdAt = coreHelper.newDateTZ();
    await this.repo.save(receipt);
    return { message: 'Tạo đơn đăng ký thành công' };
  }

  async approve(user: UserDto, dto: ApproveReceiptDto) {
    const receipt = await this.repo.findOne({ where: { id: dto.id } });
    if (!receipt) throw new NotFoundException('Không tìm thấy đơn đăng ký');
    if (receipt.status !== 'pending' && receipt.status !== 'reviewing')
      throw new BadRequestException(
        'Đơn đăng ký không ở trạng thái có thể duyệt',
      );

    const oldStatus = receipt.status;
    receipt.status = 'approved';
    receipt.approvedAmount = dto.approvedAmount;
    receipt.reviewedBy = user.id;
    receipt.reviewedAt = new Date();
    receipt.reviewNote = dto.reviewNote;
    receipt.updatedBy = user.id;
    receipt.updatedAt = coreHelper.newDateTZ();
    await this.repo.save(receipt);

    const approval = new FundReceiptApprovalEntity();
    approval.id = uuidv4();
    approval.receiptId = receipt.id;
    approval.fromStatus = oldStatus;
    approval.toStatus = 'approved';
    approval.actionBy = user.id;
    approval.actionNote = dto.reviewNote;
    approval.actionAt = new Date();
    await this.approvalRepo.save(approval);

    const actionLogDto: ActionLogCreateDto = {
      entityId: receipt.id,
      entityName: 'FUND_RECEIPT',
      actionType: enumData.ActionLogType.APPROVE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} duyệt đơn: ${receipt.code}`,
      oldValue: JSON.stringify({ status: oldStatus }),
      newValue: JSON.stringify(receipt),
    };
    await this.actionLogService.create(actionLogDto);
    return { message: 'Duyệt đơn thành công' };
  }

  async reject(user: UserDto, dto: RejectReceiptDto) {
    const receipt = await this.repo.findOne({ where: { id: dto.id } });
    if (!receipt) throw new NotFoundException('Không tìm thấy đơn đăng ký');
    if (receipt.status !== 'pending' && receipt.status !== 'reviewing')
      throw new BadRequestException(
        'Đơn đăng ký không ở trạng thái có thể từ chối',
      );

    const oldStatus = receipt.status;
    receipt.status = 'rejected';
    receipt.rejectedReason = dto.rejectedReason;
    receipt.reviewedBy = user.id;
    receipt.reviewedAt = new Date();
    receipt.updatedBy = user.id;
    receipt.updatedAt = coreHelper.newDateTZ();
    await this.repo.save(receipt);

    const approval = new FundReceiptApprovalEntity();
    approval.id = uuidv4();
    approval.receiptId = receipt.id;
    approval.fromStatus = oldStatus;
    approval.toStatus = 'rejected';
    approval.actionBy = user.id;
    approval.actionNote = dto.rejectedReason;
    approval.actionAt = new Date();
    await this.approvalRepo.save(approval);

    const actionLogDto: ActionLogCreateDto = {
      entityId: receipt.id,
      entityName: 'FUND_RECEIPT',
      actionType: enumData.ActionLogType.REJECT.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} từ chối đơn: ${receipt.code}`,
      oldValue: JSON.stringify({ status: oldStatus }),
      newValue: JSON.stringify(receipt),
    };
    await this.actionLogService.create(actionLogDto);
    return { message: 'Từ chối đơn thành công' };
  }

  async getApprovals(receiptId: string) {
    const approvals = await this.approvalRepo.find({
      where: { receiptId, isDeleted: false },
      relations: { actor: true },
      order: { actionAt: 'DESC' },
    });
    return { data: approvals };
  }
}
