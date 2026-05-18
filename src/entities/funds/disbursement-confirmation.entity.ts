import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { DisbursementEntity } from './disbursement.entity';
import { MemberEntity } from '../users/member.entity';
import { FileArchivalEntity } from '../file-archival.entity';

@Entity('disbursement-confirmations')
export class DisbursementConfirmationEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  disbursementId: string;
  @ManyToOne(() => DisbursementEntity, (d) => d.confirmations)
  @JoinColumn({ name: 'disbursementId' })
  disbursement: DisbursementEntity;

  @Column({ type: 'uuid' })
  confirmedBy: string;
  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: 'confirmedBy' })
  confirmer: MemberEntity;

  @Column({ type: 'timestamptz', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  proofFileId?: string;
  @ManyToOne(() => FileArchivalEntity)
  @JoinColumn({ name: 'proofFileId' })
  proofFile?: FileArchivalEntity;

  @Column({ type: 'text', nullable: true })
  note?: string;
}
