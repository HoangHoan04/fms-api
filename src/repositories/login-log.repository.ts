import { LoginLogEntity } from '@/entities';
import { CustomRepository } from '@/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(LoginLogEntity)
export class LoginLogRepository extends Repository<LoginLogEntity> {}
