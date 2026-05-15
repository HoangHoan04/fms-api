import {
  MemberBankAccountRepository,
  MemberRepository,
  UserRepository,
} from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { ActionLogModule } from '../action-log/action-log.module';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      MemberRepository,
      UserRepository,
      MemberBankAccountRepository,
    ]),
    FileArchivalModule,
    ActionLogModule,
  ],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
