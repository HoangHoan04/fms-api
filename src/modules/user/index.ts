import { ChildModule } from '@/common/decorators';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PREFIX_MODULE } from '../config-module';
import { NotifyModule } from '../notify/notify.module';

@ChildModule({
  prefix: PREFIX_MODULE.user,
  controllers: [],
  imports: [AuthModule, NotifyModule],
  exports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
