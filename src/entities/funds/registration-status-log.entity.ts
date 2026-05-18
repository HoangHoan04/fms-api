import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { CycleRegistrationEntity } from './cycle-registration.entity';
import { UserEntity } from '../users/user.entity';

@Entity('registration-status-logs')
export class RegistrationStatusLogEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  registrationId: string;
  @ManyToOne(() => CycleRegistrationEntity, (cr) => cr.statusLogs)
  @JoinColumn({ name: 'registrationId' })
  registration: CycleRegistrationEntity;

  @Column({ type: 'varchar', length: 20 })
  fromStatus: string;

  @Column({ type: 'varchar', length: 20 })
  toStatus: string;

  @Column({ type: 'uuid', nullable: true })
  changedBy?: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'changedBy' })
  changer?: UserEntity;

  @Column({ type: 'text', nullable: true })
  note?: string;
}
