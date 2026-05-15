import { FileDto } from '@/dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Họ và tên đầy đủ' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ description: 'Tên gọi ngắn hoặc biệt danh' })
  @IsString()
  @IsOptional()
  shortName?: string;

  @ApiProperty({ description: 'Email công việc' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'Số điện thoại liên hệ' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Giới tính: Male | Female | Other' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ description: 'Ngày sinh' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  birthday?: Date;

  @ApiPropertyOptional({ description: 'Ghi chú hoặc mô tả về nhân viên' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'URL avatar', type: [FileDto] })
  @IsArray()
  @IsOptional()
  avatar?: FileDto[];
}

export class UpdateEmployeeDto extends CreateEmployeeDto {
  @ApiProperty({ description: 'ID nhân viên' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class UpdateEmployeeAvatarDto {
  @ApiProperty({ description: 'URL ảnh đại diện mới' })
  @IsString()
  @IsNotEmpty()
  avatarUrl: string;
}

export class FilterEmployeeDto {
  @ApiPropertyOptional({ description: 'Mã nhân viên' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: 'Họ tên nhân viên' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Trạng thái xóa mềm' })
  @IsOptional()
  isDeleted?: boolean;
}
