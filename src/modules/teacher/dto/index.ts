import { FileDto } from '@/dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiPropertyOptional({ description: 'ID người dùng liên kết' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Mã giáo viên' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Họ và tên' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Email' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Ngày sinh' })
  @IsOptional()
  @IsDate()
  birthday?: Date;

  @ApiPropertyOptional({ description: 'Giới tính' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Tiểu sử' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'Chuyên môn' })
  @IsOptional()
  @IsString()
  specialties?: string;

  @ApiPropertyOptional({ description: 'Bằng cấp / chứng chỉ' })
  @IsOptional()
  @IsString()
  certifications?: string;

  @ApiPropertyOptional({ description: 'Số năm kinh nghiệm' })
  @IsOptional()
  yearsExperience?: number;

  @ApiProperty({ description: 'URL avatar của giáo viên' })
  @IsOptional()
  avatar?: FileDto[];
}

export class UpdateEmployeeDto extends CreateEmployeeDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class UpdateEmployeeAvatarDto {
  @ApiProperty({ description: 'url avatar' })
  @IsString()
  avatarUrl: string;
}
