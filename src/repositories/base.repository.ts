import {
  ActionLogEntity,
  FileArchivalEntity,
  LoginLogEntity,
  SystemConfigEntity,
} from '@/entities';
import { CustomRepository } from '@/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(ActionLogEntity)
export class ActionLogRepository extends Repository<ActionLogEntity> {}

@CustomRepository(FileArchivalEntity)
export class FileArchivalRepository extends Repository<FileArchivalEntity> {}

@CustomRepository(SystemConfigEntity)
export class SystemConfigRepository extends Repository<SystemConfigEntity> {}

@CustomRepository(LoginLogEntity)
export class LoginLogRepository extends Repository<LoginLogEntity> {}
