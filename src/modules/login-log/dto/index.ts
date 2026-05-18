import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class LoginLogFilterDto {
  @ApiProperty({ description: 'ID người dùng', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    description: 'Kết quả: success | failed | blocked',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Lý do thất bại', required: false })
  @IsOptional()
  @IsString()
  failReason?: string;

  @ApiProperty({ description: 'Loại thiết bị', required: false })
  @IsOptional()
  @IsString()
  deviceType?: string;
}

export class CreateLoginLogDto {
  @ApiProperty({ description: 'ID tài khoản người dùng' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Kết quả: success | failed | blocked' })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({ description: 'Lý do thất bại', required: false })
  @IsOptional()
  @IsString()
  failReason?: string;

  @ApiProperty({ description: 'Địa chỉ IP', required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({ description: 'Thông tin trình duyệt / app', required: false })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({
    description: 'Loại thiết bị: web | mobile | desktop',
    required: false,
  })
  @IsOptional()
  @IsString()
  deviceType?: string;

  @ApiProperty({ description: 'Thời điểm đăng nhập', required: false })
  @IsOptional()
  @IsDate()
  loggedInAt?: Date;
}

export class UpdateLoginLogDto {
  @ApiProperty({ description: 'Kết quả', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Lý do thất bại', required: false })
  @IsOptional()
  @IsString()
  failReason?: string;

  @ApiProperty({ description: 'Địa chỉ IP', required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({ description: 'Thông tin trình duyệt / app', required: false })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({ description: 'Loại thiết bị', required: false })
  @IsOptional()
  @IsString()
  deviceType?: string;

  @ApiProperty({ description: 'Thời điểm đăng nhập', required: false })
  @IsOptional()
  @IsDate()
  loggedInAt?: Date;
}

export class CreateManyLoginLogDto {
  @ApiProperty({ description: 'Danh sách login logs' })
  @IsNotEmpty()
  logs: CreateLoginLogDto[];
}
