import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@/typeorm';
import {
  FundCycleRepository,
  FundMemberRepository,
  ContributionRepository,
} from '@/repositories';
import { ActionLogModule } from '../action-log/action-log.module';
import { FundCycleController } from './fund-cycle.controller';
import { FundCycleService } from './fund-cycle.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      FundCycleRepository,
      FundMemberRepository,
      ContributionRepository,
    ]),
    ActionLogModule,
  ],
  controllers: [FundCycleController],
  providers: [FundCycleService],
  exports: [FundCycleService],
})
export class FundCycleModule {}
