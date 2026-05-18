import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class FileArchivalFilterDto {
  @ApiProperty({ description: 'Tên file', required: false })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({
    description: 'Loại file: image | video | audio | pdf | docx | spreadsheet',
    required: false,
  })
  @IsOptional()
  @IsString()
  fileType?: string;

  @ApiProperty({ description: 'Module sử dụng', required: false })
  @IsOptional()
  @IsString()
  moduleType?: string;

  @ApiProperty({ description: 'Nhà cung cấp lưu trữ', required: false })
  @IsOptional()
  @IsString()
  storageProvider?: string;

  @ApiProperty({ description: 'Người upload', required: false })
  @IsOptional()
  @IsUUID()
  uploadedBy?: string;

  @ApiProperty({ description: 'Đã xóa?', required: false })
  @IsOptional()
  isDeleted?: boolean;
}

export class CreateFileArchivalDto {
  @ApiProperty({ description: 'Tên file gốc khi upload' })
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty({ description: 'URL truy cập file (CDN hoặc storage)' })
  @IsNotEmpty()
  @IsString()
  fileUrl: string;

  @ApiProperty({
    description: 'Loại file: image | video | audio | pdf | docx | spreadsheet',
    required: false,
  })
  @IsOptional()
  @IsString()
  fileType?: string;

  @ApiProperty({
    description: 'Dung lượng file tính bằng byte',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  fileSizeBytes?: number;

  @ApiProperty({
    description: 'Đuôi mở rộng, VD: jpg | png | pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  extension?: string;

  @ApiProperty({
    description: 'MIME type, VD: image/jpeg | application/pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({
    description:
      'Module sử dụng: member_qr | contribution_proof | disbursement_proof | avatar',
    required: false,
  })
  @IsOptional()
  @IsString()
  moduleType?: string;

  @ApiProperty({
    description: 'Nhà cung cấp lưu trữ: s3 | gcs | local | cloudinary',
    required: false,
  })
  @IsOptional()
  @IsString()
  storageProvider?: string;

  @ApiProperty({
    description: 'Đường dẫn nội bộ trên storage',
    required: false,
  })
  @IsOptional()
  @IsString()
  storagePath?: string;

  @ApiProperty({ description: 'Người đã upload file', required: false })
  @IsOptional()
  @IsUUID()
  uploadedBy?: string;
}

export class UpdateFileArchivalDto {
  @ApiProperty({ description: 'Tên file gốc khi upload', required: false })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({
    description: 'URL truy cập file (CDN hoặc storage)',
    required: false,
  })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiProperty({ description: 'Loại file', required: false })
  @IsOptional()
  @IsString()
  fileType?: string;

  @ApiProperty({
    description: 'Dung lượng file tính bằng byte',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  fileSizeBytes?: number;

  @ApiProperty({ description: 'Đuôi mở rộng', required: false })
  @IsOptional()
  @IsString()
  extension?: string;

  @ApiProperty({ description: 'MIME type', required: false })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({ description: 'Module sử dụng', required: false })
  @IsOptional()
  @IsString()
  moduleType?: string;

  @ApiProperty({ description: 'Nhà cung cấp lưu trữ', required: false })
  @IsOptional()
  @IsString()
  storageProvider?: string;

  @ApiProperty({
    description: 'Đường dẫn nội bộ trên storage',
    required: false,
  })
  @IsOptional()
  @IsString()
  storagePath?: string;

  @ApiProperty({ description: 'Người đã upload file', required: false })
  @IsOptional()
  @IsUUID()
  uploadedBy?: string;
}

export class CreateManyFileArchivalDto {
  @ApiProperty({
    description: 'Danh sách file cần tạo',
    type: [CreateFileArchivalDto],
  })
  @IsNotEmpty()
  files: CreateFileArchivalDto[];
}
