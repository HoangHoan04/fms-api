import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@/typeorm';
import { RoleRepository } from '@/repositories/user.repository';
import { RoleService } from './role.service';
import { AdminRoleController } from './controllers/admin-role.controller';
import { ActionLogModule } from '../action-log/action-log.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([RoleRepository]),
    ActionLogModule,
  ],
  controllers: [AdminRoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
