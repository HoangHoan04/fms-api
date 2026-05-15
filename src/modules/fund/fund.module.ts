import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@/typeorm';
import { FundRepository, FundMemberRepository } from '@/repositories';
import { ActionLogModule } from '../action-log/action-log.module';
import { FundController } from './fund.controller';
import { FundService } from './fund.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      FundRepository,
      FundMemberRepository,
    ]),
    ActionLogModule,
  ],
  controllers: [FundController],
  providers: [FundService],
  exports: [FundService],
})
export class FundModule {}
