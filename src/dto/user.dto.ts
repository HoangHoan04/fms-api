import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserDto {
  @ApiProperty({ description: 'Id người dùng' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'Mã người dùng' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Tên đăng nhập' })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Nhà cung cấp đăng nhập',
    enum: ['local', 'google', 'facebook'],
  })
  @IsOptional()
  @IsString()
  loginProvider?: string;

  @ApiProperty({ description: 'Google ID' })
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiProperty({ description: 'Facebook ID' })
  @IsOptional()
  @IsString()
  facebookId?: string;

  @ApiProperty({ description: 'Đã xác thực email?' })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ description: 'Là admin?' })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @ApiProperty({ description: 'Lần đăng nhập cuối' })
  @IsOptional()
  @IsDate()
  lastLoginAt?: Date;

  @ApiProperty({ description: 'Tài khoản có đang hoạt động không' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Id thành viên' })
  @IsOptional()
  @IsString()
  memberId?: string;

  @ApiProperty({ description: 'Id giáo viên' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiProperty({ description: 'Danh sách quyền của người dùng' })
  @IsOptional()
  permissions?: string[];
}
