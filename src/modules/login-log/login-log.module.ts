import { LoginLogRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { LoginLogService } from './login-log.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([LoginLogRepository])],
  controllers: [],
  providers: [LoginLogService],
  exports: [LoginLogService],
})
export class LoginLogModule {}
