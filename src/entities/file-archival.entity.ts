import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DisbursementConfirmationEntity, FundReceiptEntity } from './funds';
import {
  EmployeeEntity,
  MemberBankAccountEntity,
  MemberEntity,
  UserEntity,
} from './users';

/** Kho lưu trữ file upload tập trung cho toàn hệ thống */
@Entity('file-archives')
export class FileArchivalEntity extends BaseEntity {
  /** Tên file gốc khi upload */
  @ApiProperty({ description: 'Tên file gốc khi upload' })
  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  /** URL truy cập file (CDN hoặc storage) */
  @ApiProperty({ description: 'URL truy cập file (CDN hoặc storage)' })
  @Column({ type: 'varchar', length: 500 })
  fileUrl: string;

  /** Loại file: image | video | audio | pdf | docx | spreadsheet */
  @ApiProperty({
    description: 'Loại file: image | video | audio | pdf | docx | spreadsheet',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  fileType?: string;

  /** Dung lượng file tính bằng byte */
  @ApiProperty({ description: 'Dung lượng file tính bằng byte' })
  @Column({ type: 'bigint', nullable: true })
  fileSizeBytes?: number;

  /** Đuôi mở rộng, VD: jpg | png | pdf */
  @ApiProperty({ description: 'Đuôi mở rộng của file, VD: jpg | png | pdf' })
  @Column({ type: 'varchar', length: 10, nullable: true })
  extension?: string;

  /** MIME type, VD: image/jpeg | application/pdf */
  @ApiProperty({
    description: 'MIME type của file, VD: image/jpeg | application/pdf',
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  mimeType?: string;

  /** UUID của bản ghi sử dụng file này */
  @ApiProperty({ description: 'UUID của bản ghi sử dụng file này' })
  @Column({ type: 'uuid', nullable: true })
  relatedId?: string;

  /** Module sử dụng, VD: member | contribution | receipt */
  @ApiProperty({
    description: 'Module sử dụng file này, VD: member | contribution | receipt',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  moduleType?: string;

  /** Nhà cung cấp lưu trữ: s3 | gcs | local | cloudinary */
  @ApiProperty({
    description: 'Nhà cung cấp lưu trữ, VD: s3 | gcs | local | cloudinary',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  storageProvider?: string;

  /** Đường dẫn nội bộ trên storage (bucket/path) */
  @ApiProperty({
    description: 'Đường dẫn nội bộ trên storage, VD: bucket/path/to/file',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  storagePath?: string;

  /** Hash SHA-256 để kiểm tra toàn vẹn file */
  @ApiProperty({ description: 'Hash SHA-256 của file để kiểm tra toàn vẹn' })
  @Column({ type: 'varchar', length: 64, nullable: true })
  checksum?: string;

  /** Người đã upload file */
  @ApiProperty({ description: 'ID người đã upload file' })
  @Column({ type: 'uuid', nullable: true })
  uploadedBy?: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'uploadedBy' })
  uploader?: UserEntity;

  /** Mô tả tệp (legacy) */
  @ApiProperty({ description: 'Mô tả tệp (legacy)' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  /** Avatar thành viên */
  @Column({ type: 'uuid', nullable: true })
  memberId?: string;
  @ManyToOne(() => MemberEntity, (p) => p.avatar)
  @JoinColumn({ name: 'memberId' })
  member: Promise<MemberEntity>;

  /** qrCode thành viên */
  @Column({ type: 'uuid', nullable: true })
  qrCodeId?: string;
  @ManyToOne(() => MemberBankAccountEntity, (p) => p.qrCode)
  @JoinColumn({ name: 'qrCodeId' })
  qrCode: Promise<MemberBankAccountEntity>;

  /** Avatar nhân viên */
  @Column({ type: 'uuid', nullable: true })
  employeeId?: string;
  @ManyToOne(() => EmployeeEntity, (p) => p.avatar)
  @JoinColumn({ name: 'employeeId' })
  employee: Promise<EmployeeEntity>;

  /** Tài liệu đăng ký quxy */
  @Column({ type: 'uuid', nullable: true })
  fundReceiptId?: string;
  @ManyToOne(() => FundReceiptEntity, (p) => p.documents)
  @JoinColumn({ name: 'fundReceiptId' })
  fundReceipt: Promise<FundReceiptEntity>;

  /** Hình ảnh xác nhận nhân quỹ */
  @Column({ type: 'uuid', nullable: true })
  disbursementConfirmationId?: string;
  @ManyToOne(() => DisbursementConfirmationEntity, (p) => p.proofFile)
  @JoinColumn({ name: 'disbursementConfirmation' })
  disbursementConfirmation: Promise<DisbursementConfirmationEntity>;
}
