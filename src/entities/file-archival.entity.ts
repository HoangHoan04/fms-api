import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './users/user.entity';

@Entity('file-archives')
export class FileArchivalEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên file gốc khi upload' })
  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  @ApiProperty({ description: 'URL truy cập file (CDN hoặc storage)' })
  @Column({ type: 'varchar', length: 500 })
  fileUrl: string;

  @ApiProperty({
    description: 'Loại file: image | video | audio | pdf | docx | spreadsheet',
  })
  @Column({ type: 'varchar', length: 20, nullable: true })
  fileType?: string;

  @ApiProperty({ description: 'Dung lượng file tính bằng byte' })
  @Column({ type: 'bigint', nullable: true })
  fileSizeBytes?: number;

  @ApiProperty({ description: 'Đuôi mở rộng, VD: jpg | png | pdf' })
  @Column({ type: 'varchar', length: 10, nullable: true })
  extension?: string;

  @ApiProperty({ description: 'MIME type, VD: image/jpeg | application/pdf' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  mimeType?: string;

  @ApiProperty({
    description:
      'Module sử dụng: member_qr | contribution_proof | disbursement_proof | avatar',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  moduleType?: string;

  @ApiProperty({
    description: 'Nhà cung cấp lưu trữ: s3 | gcs | local | cloudinary',
  })
  @Column({ type: 'varchar', length: 30, nullable: true })
  storageProvider?: string;

  @ApiProperty({ description: 'Đường dẫn nội bộ trên storage' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  storagePath?: string;

  @ApiProperty({ description: 'Người đã upload file' })
  @Column({ type: 'uuid', nullable: true })
  uploadedBy?: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'uploadedBy' })
  uploader?: UserEntity;
}
