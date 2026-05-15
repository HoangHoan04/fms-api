import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { EmployeeEntity, MemberEntity, UserEntity } from './users';

/** Kho lưu trữ file upload tập trung cho toàn hệ thống */
@Entity('file-archives')
export class FileArchivalEntity extends BaseEntity {
  /** Tên file gốc khi upload */
  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  /** URL truy cập file (CDN hoặc storage) */
  @Column({ type: 'varchar', length: 500 })
  fileUrl: string;

  /** Loại file: image | video | audio | pdf | docx | spreadsheet */
  @Column({ type: 'varchar', length: 50, nullable: true })
  fileType?: string;

  /** Dung lượng file tính bằng byte */
  @Column({ type: 'bigint', nullable: true })
  fileSizeBytes?: number;

  /** Đuôi mở rộng, VD: jpg | png | pdf */
  @Column({ type: 'varchar', length: 10, nullable: true })
  extension?: string;

  /** MIME type, VD: image/jpeg | application/pdf */
  @Column({ type: 'varchar', length: 100, nullable: true })
  mimeType?: string;

  /** UUID của bản ghi sử dụng file này */
  @Column({ type: 'uuid', nullable: true })
  relatedId?: string;

  /** Module sử dụng, VD: member | contribution | receipt */
  @Column({ type: 'varchar', length: 50, nullable: true })
  moduleType?: string;

  /** Nhà cung cấp lưu trữ: s3 | gcs | local | cloudinary */
  @Column({ type: 'varchar', length: 50, nullable: true })
  storageProvider?: string;

  /** Đường dẫn nội bộ trên storage (bucket/path) */
  @Column({ type: 'varchar', length: 500, nullable: true })
  storagePath?: string;

  /** Hash SHA-256 để kiểm tra toàn vẹn file */
  @Column({ type: 'varchar', length: 64, nullable: true })
  checksum?: string;

  /** Người đã upload file */
  @Column({ type: 'uuid', nullable: true })
  uploadedBy?: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'uploadedBy' })
  uploader?: UserEntity;

  /** Mô tả tệp (legacy) */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /** Avatar thành viên */
  @Column({ type: 'uuid', nullable: true })
  memberId?: string;
  @ManyToOne(() => MemberEntity, (p) => p.avatar)
  @JoinColumn({ name: 'memberId' })
  member: Promise<MemberEntity>;

  /** Avatar nhân viên */
  @Column({ type: 'uuid', nullable: true })
  employeeId?: string;
  @ManyToOne(() => EmployeeEntity, (p) => p.avatar)
  @JoinColumn({ name: 'employeeId' })
  employee: Promise<EmployeeEntity>;

  // Legacy FK columns used by other modules
  @Column({ type: 'uuid', nullable: true })
  bannerId?: string;

  @Column({ type: 'uuid', nullable: true })
  blogPostId?: string;

  @Column({ type: 'uuid', nullable: true })
  newId?: string;

  @Column({ type: 'uuid', nullable: true })
  memberId?: string;

  @Column({ type: 'uuid', nullable: true })
  employeeId?: string;
}
