import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FundReceiptEntity } from './fund-receipt.entity';
import { FileArchivalEntity } from '../file-archival.entity';

/** Tài liệu đính kèm cho đơn đăng ký nhận tiền (giấy tờ chứng minh) */
@Entity('fund-receipt-documents')
export class FundReceiptDocumentEntity extends BaseEntity {
  /** Đơn đăng ký mà tài liệu này đính kèm */
  @Column({ type: 'uuid' })
  receiptId: string;
  @ManyToOne(() => FundReceiptEntity, (fr) => fr.documents)
  @JoinColumn({ name: 'receiptId' })
  receipt: FundReceiptEntity;

  /** File đã upload (ảnh chứng từ, giấy bệnh viện, ...) */
  @Column({ type: 'uuid', nullable: true })
  fileId?: string;
  @ManyToOne(() => FileArchivalEntity)
  @JoinColumn({ name: 'fileId' })
  file?: FileArchivalEntity;

  /** Loại tài liệu: medical | certificate | invoice | other */
  @Column({ type: 'varchar', length: 50, nullable: true })
  documentType?: string;

  /** Mô tả ngắn về tài liệu */
  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;
}
