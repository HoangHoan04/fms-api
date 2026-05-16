import {
  FundReceiptApprovalRepository,
  FundReceiptRepository,
} from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { ActionLogModule } from '../action-log/action-log.module';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      FundReceiptRepository,
      FundReceiptApprovalRepository,
    ]),
    FileArchivalModule,
    ActionLogModule,
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService],
  exports: [ReceiptService],
})
export class ReceiptModule {}
