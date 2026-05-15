import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@/typeorm';
import {
  RoleRepository,
  RolePermissionRepository,
} from '@/repositories/user.repository';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { ActionLogModule } from '../action-log/action-log.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      RoleRepository,
      RolePermissionRepository,
    ]),
    ActionLogModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
