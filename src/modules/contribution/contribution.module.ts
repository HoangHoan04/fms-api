import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@/typeorm';
import {
  ContributionRepository,
  ContributionReminderRepository,
  FundCycleRepository,
} from '@/repositories';
import { ActionLogModule } from '../action-log/action-log.module';
import { ContributionController } from './contribution.controller';
import { ContributionService } from './contribution.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      ContributionRepository,
      ContributionReminderRepository,
      FundCycleRepository,
    ]),
    ActionLogModule,
  ],
  controllers: [ContributionController],
  providers: [ContributionService],
  exports: [ContributionService],
})
export class ContributionModule {}
