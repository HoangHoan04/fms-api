import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@/typeorm';
import {
  FundTransactionRepository,
  MemberReceiptHistoryRepository,
} from '@/repositories';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      FundTransactionRepository,
      MemberReceiptHistoryRepository,
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
