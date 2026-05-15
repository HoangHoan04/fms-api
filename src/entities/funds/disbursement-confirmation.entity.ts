import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { DisbursementEntity } from './disbursement.entity';
import { MemberEntity } from '../users/member.entity';
import { FileArchivalEntity } from '../file-archival.entity';

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

  /** Ảnh chụp biên lai / màn hình giao dịch của người nhận */
  @Column({ type: 'uuid', nullable: true })
  proofFileId?: string;
  @ManyToOne(() => FileArchivalEntity)
  @JoinColumn({ name: 'proofFileId' })
  proofFile?: FileArchivalEntity;

  /** Ghi chú xác nhận */
  @Column({ type: 'text', nullable: true })
  note?: string;
}
