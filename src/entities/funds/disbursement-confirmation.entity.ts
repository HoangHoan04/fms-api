import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FileArchivalEntity } from '../file-archival.entity';
import { MemberEntity } from '../users/member.entity';
import { DisbursementEntity } from './disbursement.entity';

/** Xác nhận người nhận đã thực sự nhận được tiền */
@Entity('disbursement-confirmations')
export class DisbursementConfirmationEntity extends BaseEntity {
  /** Phiếu giải ngân cần xác nhận */
  @Column({ type: 'uuid' })
  disbursementId: string;
  @ManyToOne(() => DisbursementEntity, (d) => d.confirmations)
  @JoinColumn({ name: 'disbursementId' })
  disbursement: DisbursementEntity;

  /** Thời điểm người nhận xác nhận */
  @Column({ type: 'timestamptz', nullable: true })
  confirmedAt?: Date;

  /** Thành viên xác nhận đã nhận tiền */
  @Column({ type: 'uuid', nullable: true })
  confirmedBy?: string;
  @ManyToOne(() => MemberEntity)
  @JoinColumn({ name: 'confirmedBy' })
  confirmer?: MemberEntity;

  /** Các file chứng minh đã nhận tiền */
  @OneToMany(() => FileArchivalEntity, (p) => p.disbursementConfirmation)
  proofFile: Promise<FileArchivalEntity[]>;

  /** Ghi chú xác nhận */
  @Column({ type: 'text', nullable: true })
  note?: string;
}
