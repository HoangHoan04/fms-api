import {
  ContributionEntity,
  ContributionReminderEntity,
  CycleEntity,
  CycleRegistrationEntity,
  DisbursementConfirmationEntity,
  DisbursementEntity,
  FundTransactionEntity,
  MomoTransactionEntity,
  RegistrationStatusLogEntity,
} from '@/entities';
import { CustomRepository } from '@/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(CycleEntity)
export class CycleRepository extends Repository<CycleEntity> {}

@CustomRepository(CycleRegistrationEntity)
export class CycleRegistrationRepository extends Repository<CycleRegistrationEntity> {}

@CustomRepository(ContributionEntity)
export class ContributionRepository extends Repository<ContributionEntity> {}

@CustomRepository(ContributionReminderEntity)
export class ContributionReminderRepository extends Repository<ContributionReminderEntity> {}

@CustomRepository(DisbursementEntity)
export class DisbursementRepository extends Repository<DisbursementEntity> {}

@CustomRepository(DisbursementConfirmationEntity)
export class DisbursementConfirmationRepository extends Repository<DisbursementConfirmationEntity> {}

@CustomRepository(FundTransactionEntity)
export class FundTransactionRepository extends Repository<FundTransactionEntity> {}

@CustomRepository(MomoTransactionEntity)
export class MomoTransactionRepository extends Repository<MomoTransactionEntity> {}

@CustomRepository(RegistrationStatusLogEntity)
export class RegistrationStatusLogRepository extends Repository<RegistrationStatusLogEntity> {}
