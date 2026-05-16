import {
  ContributionEntity,
  ContributionReminderEntity,
  DisbursementConfirmationEntity,
  DisbursementEntity,
  FundCycleEntity,
  FundCycleSummaryEntity,
  FundEntity,
  FundMemberEntity,
  FundReceiptApprovalEntity,
  FundReceiptEntity,
  FundTransactionEntity,
  MemberReceiptHistoryEntity,
} from '@/entities';
import { CustomRepository } from '@/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(FundEntity)
export class FundRepository extends Repository<FundEntity> {}

@CustomRepository(FundMemberEntity)
export class FundMemberRepository extends Repository<FundMemberEntity> {}

@CustomRepository(FundCycleEntity)
export class FundCycleRepository extends Repository<FundCycleEntity> {}

@CustomRepository(ContributionEntity)
export class ContributionRepository extends Repository<ContributionEntity> {}

@CustomRepository(ContributionReminderEntity)
export class ContributionReminderRepository extends Repository<ContributionReminderEntity> {}

@CustomRepository(FundReceiptEntity)
export class FundReceiptRepository extends Repository<FundReceiptEntity> {}

@CustomRepository(FundReceiptApprovalEntity)
export class FundReceiptApprovalRepository extends Repository<FundReceiptApprovalEntity> {}

@CustomRepository(DisbursementEntity)
export class DisbursementRepository extends Repository<DisbursementEntity> {}

@CustomRepository(DisbursementConfirmationEntity)
export class DisbursementConfirmationRepository extends Repository<DisbursementConfirmationEntity> {}

@CustomRepository(MemberReceiptHistoryEntity)
export class MemberReceiptHistoryRepository extends Repository<MemberReceiptHistoryEntity> {}

@CustomRepository(FundCycleSummaryEntity)
export class FundCycleSummaryRepository extends Repository<FundCycleSummaryEntity> {}

@CustomRepository(FundTransactionEntity)
export class FundTransactionRepository extends Repository<FundTransactionEntity> {}
