import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { NotifyService } from './notify.service';
import { NotifyRepository, UserRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';

@Module({
  providers: [NotifyService],
  exports: [NotifyService],
  controllers: [],
  imports: [
    TypeOrmExModule.forCustomRepository([NotifyRepository, UserRepository]),
  ],
})
export class NotifyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
