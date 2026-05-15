import { FileArchivalRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { FileArchivalController } from './file-archival.controller';
import { FileArchivalService } from './file-archival.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([FileArchivalRepository])],
  controllers: [FileArchivalController],
  providers: [FileArchivalService],
  exports: [FileArchivalService],
})
export class FileArchivalModule {}
