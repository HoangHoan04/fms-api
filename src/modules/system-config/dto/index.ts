import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSystemConfigDto {
  @ApiProperty({ description: 'Key (khóa cấu hình)' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Giá trị' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ description: 'Mã cấu hình' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Tên cấu hình' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Mô tả' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Loại dữ liệu' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Tab cấu hình' })
  @IsOptional()
  @IsString()
  settingTab?: string;

  @ApiPropertyOptional({ description: 'Nhóm cấu hình' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateSystemConfigDto {
  @ApiProperty({ description: 'ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Giá trị' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ description: 'Mô tả' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class FilterSystemConfigDto {
  @ApiPropertyOptional({ description: 'Key' })
  @IsOptional()
  @IsString()
  key?: string;

  @ApiPropertyOptional({ description: 'Nhóm cấu hình' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Tab cấu hình' })
  @IsOptional()
  @IsString()
  settingTab?: string;
}
