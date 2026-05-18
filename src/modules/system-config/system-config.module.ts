import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@/typeorm';
import { SystemConfigRepository } from '@/repositories';
import { SystemConfigController } from './controllers/system-config-admin.controller';
import { SystemConfigService } from './system-config.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([SystemConfigRepository])],
  controllers: [SystemConfigController],
  providers: [SystemConfigService],
  exports: [SystemConfigService],
})
export class SystemConfigModule {}
