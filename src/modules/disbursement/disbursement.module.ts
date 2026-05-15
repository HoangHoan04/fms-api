import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@/typeorm';
import {
  DisbursementRepository,
  DisbursementConfirmationRepository,
} from '@/repositories';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { DisbursementController } from './disbursement.controller';
import { DisbursementService } from './disbursement.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      DisbursementRepository,
      DisbursementConfirmationRepository,
    ]),
    FileArchivalModule,
    ActionLogModule,
  ],
  controllers: [DisbursementController],
  providers: [DisbursementService],
  exports: [DisbursementService],
})
export class DisbursementModule {}
