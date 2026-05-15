import { FileArchivalRepository } from '@/repositories';
import {
  EmployeeRepository,
  UserRepository,
} from '@/repositories/user.repository';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { ActionLogModule } from '../action-log/action-log.module';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      EmployeeRepository,
      FileArchivalRepository,
      UserRepository,
    ]),
    ActionLogModule,
    FileArchivalModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
