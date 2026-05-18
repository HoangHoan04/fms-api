import { ActionLogRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ActionLogService } from './action-log.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ActionLogRepository])],
  controllers: [],
  providers: [ActionLogService],
  exports: [ActionLogService],
})
export class ActionLogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
