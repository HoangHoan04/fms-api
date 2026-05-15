import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateFileArchivalDto {
  @ApiProperty({ description: 'Tên file gốc khi upload' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ description: 'URL truy cập file (CDN hoặc storage)' })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiPropertyOptional({
    description: 'Loại file: image | video | audio | pdf | docx | spreadsheet',
  })
  @IsString()
  @IsOptional()
  fileType?: string;

  @ApiPropertyOptional({ description: 'Dung lượng file tính bằng byte' })
  @IsNumber()
  @IsOptional()
  fileSizeBytes?: number;

  @ApiPropertyOptional({ description: 'Đuôi mở rộng, VD: jpg | png | pdf' })
  @IsString()
  @IsOptional()
  extension?: string;

  @ApiPropertyOptional({
    description: 'MIME type, VD: image/jpeg | application/pdf',
  })
  @IsString()
  @IsOptional()
  mimeType?: string;

  @ApiPropertyOptional({ description: 'UUID của bản ghi sử dụng file này' })
  @IsUUID()
  @IsOptional()
  relatedId?: string;

  @ApiPropertyOptional({
    description: 'Module sử dụng, VD: member | contribution | receipt',
  })
  @IsString()
  @IsOptional()
  moduleType?: string;

  @ApiPropertyOptional({
    description: 'Nhà cung cấp lưu trữ, VD: s3 | gcs | local | cloudinary',
  })
  @IsString()
  @IsOptional()
  storageProvider?: string;

  @ApiPropertyOptional({
    description: 'Đường dẫn nội bộ trên storage, VD: bucket/path/to/file',
  })
  @IsString()
  @IsOptional()
  storagePath?: string;

  @ApiPropertyOptional({
    description: 'Hash SHA-256 của file để kiểm tra toàn vẹn',
  })
  @IsString()
  @IsOptional()
  checksum?: string;

  @ApiPropertyOptional({ description: 'ID người đã upload file' })
  @IsUUID()
  @IsOptional()
  uploadedBy?: string;

  @ApiPropertyOptional({ description: 'Mô tả tệp' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'ID member (avatar)' })
  @IsUUID()
  @IsOptional()
  memberId?: string;

  @ApiPropertyOptional({ description: 'ID employee' })
  @IsUUID()
  @IsOptional()
  employeeId?: string;

  @ApiPropertyOptional({ description: 'ID qrCode của tài khoản ngân hàng' })
  @IsUUID()
  @IsOptional()
  qrCodeId?: string;

  @ApiProperty({ description: 'Người tạo, lưu user.id' })
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}

export class UpdateFileArchivalDto extends CreateFileArchivalDto {
  @ApiProperty({ description: 'ID của file archival' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class CreateManyFileArchivalDto {
  @ApiProperty({ description: 'Danh sách file', type: [CreateFileArchivalDto] })
  @IsArray()
  files: CreateFileArchivalDto[];
}

export class FilterFileArchivalDto {
  @ApiPropertyOptional({ description: 'Tên file' })
  @IsString()
  @IsOptional()
  fileName?: string;

  @ApiPropertyOptional({ description: 'Loại file' })
  @IsString()
  @IsOptional()
  fileType?: string;

  @ApiPropertyOptional({ description: 'Module sử dụng' })
  @IsString()
  @IsOptional()
  moduleType?: string;

  @ApiPropertyOptional({ description: 'relatedId' })
  @IsString()
  @IsOptional()
  relatedId?: string;

  @ApiPropertyOptional({ description: 'Trạng thái xóa' })
  @IsOptional()
  isDeleted?: boolean;
}
