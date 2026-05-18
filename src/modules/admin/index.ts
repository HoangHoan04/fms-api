import { ChildModule } from '@/common/decorators';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ActionLogModule } from '../action-log/action-log.module';
import { AdminActionLogController } from '../action-log/controller/action-log-admin.controller';
import { AuthModule } from '../auth/auth.module';
import { PREFIX_MODULE } from '../config-module';
import { NotifyModule } from '../notify/notify.module';
import { PermissionModule } from '../permission/permission.module';
import { RoleModule } from '../role/role.module';

@ChildModule({
  prefix: PREFIX_MODULE.admin,
  controllers: [AdminActionLogController],
  imports: [
    AuthModule,
    ActionLogModule,
    NotifyModule,
    RoleModule,
    PermissionModule,
  ],
  exports: [],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
