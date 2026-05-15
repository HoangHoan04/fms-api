import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@/typeorm';
import {
  FundReceiptRepository,
  FundReceiptDocumentRepository,
  FundReceiptApprovalRepository,
} from '@/repositories';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { ActionLogModule } from '../action-log/action-log.module';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      FundReceiptRepository,
      FundReceiptDocumentRepository,
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
