import { FileArchivalRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FileArchivalService } from './file-archival.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([FileArchivalRepository])],
  controllers: [],
  providers: [FileArchivalService],
  exports: [FileArchivalService],
})
export class FileArchivalModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
