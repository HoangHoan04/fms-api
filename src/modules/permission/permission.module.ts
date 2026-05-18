import {
  PermissionRepository,
  RolePermissionRepository,
} from '@/repositories/user.repository';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { ActionLogModule } from '../action-log/action-log.module';
import { PermissionController } from './controllers/permission-admin.controller';
import { PermissionService } from './permission.service';
import { ModuleDiscoveryService } from './services/module-discovery.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      PermissionRepository,
      RolePermissionRepository,
    ]),
    ActionLogModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService, ModuleDiscoveryService],
  exports: [PermissionService, ModuleDiscoveryService],
})
export class PermissionModule {}
