import {
  PermissionRepository,
  RolePermissionRepository,
  UserPermissionRepository,
} from '@/repositories/user.repository';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ModuleDiscoveryService } from './services/module-discovery.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      PermissionRepository,
      RolePermissionRepository,
      UserPermissionRepository,
    ]),
  ],
  controllers: [],
  providers: [PermissionService, ModuleDiscoveryService],
  exports: [PermissionService, ModuleDiscoveryService],
})
export class PermissionModule {}
