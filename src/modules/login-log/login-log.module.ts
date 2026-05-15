import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@/typeorm';
import { LoginLogRepository } from '@/repositories';
import { LoginLogController } from './login-log.controller';
import { LoginLogService } from './login-log.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([LoginLogRepository])],
  controllers: [LoginLogController],
  providers: [LoginLogService],
  exports: [LoginLogService],
})
export class LoginLogModule {}
