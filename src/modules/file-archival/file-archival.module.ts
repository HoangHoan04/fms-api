import { FileArchivalRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { FileArchivalService } from './file-archival.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([FileArchivalRepository])],
  providers: [FileArchivalService],
  exports: [FileArchivalService],
})
export class FileArchivalModule {}
