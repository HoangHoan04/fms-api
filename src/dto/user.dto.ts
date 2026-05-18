import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class UserDto {
  @ApiProperty({ description: 'ID người dùng' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Mã định danh ngắn gọn (VD: USR-0001)' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Email đăng nhập' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Tên đăng nhập' })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Nhà cung cấp đăng nhập: local | google | facebook',
    required: false,
  })
  @IsOptional()
  @IsString()
  loginProvider?: string;

  @ApiProperty({ description: 'Google ID', required: false })
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiProperty({ description: 'Facebook ID', required: false })
  @IsOptional()
  @IsString()
  facebookId?: string;

  @ApiProperty({ description: 'Đã xác thực email?', required: false })
  @IsOptional()
  isVerified?: boolean;

  @ApiProperty({ description: 'Là admin?', required: false })
  @IsOptional()
  isAdmin?: boolean;

  @ApiProperty({ description: 'Lần đăng nhập cuối', required: false })
  @IsOptional()
  lastLoginAt?: Date;

  @ApiProperty({ description: 'ID thành viên', required: false })
  @IsOptional()
  @IsUUID()
  memberId?: string;

  @ApiProperty({ description: 'Thời gian tạo' })
  createdAt: Date;

  @ApiProperty({ description: 'Người tạo' })
  createdBy: string;

  @ApiProperty({ description: 'Thời gian cập nhật', required: false })
  updatedAt?: Date;

  @ApiProperty({ description: 'Người cập nhật', required: false })
  updatedBy?: string;

  @ApiProperty({ description: 'Đã xóa?', required: false })
  isDeleted?: boolean;
}

export class CreateUserDto {
  @ApiProperty({ description: 'Email đăng nhập' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Tên đăng nhập' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Mật khẩu' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Nhà cung cấp đăng nhập', required: false })
  @IsOptional()
  @IsString()
  loginProvider?: string;

  @ApiProperty({ description: 'Google ID', required: false })
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiProperty({ description: 'Facebook ID', required: false })
  @IsOptional()
  @IsString()
  facebookId?: string;

  @ApiProperty({ description: 'ID thành viên', required: false })
  @IsOptional()
  @IsUUID()
  memberId?: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Email đăng nhập', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Tên đăng nhập', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'Mật khẩu', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ description: 'Google ID', required: false })
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiProperty({ description: 'Facebook ID', required: false })
  @IsOptional()
  @IsString()
  facebookId?: string;

  @ApiProperty({ description: 'Đã xác thực email?', required: false })
  @IsOptional()
  isVerified?: boolean;

  @ApiProperty({ description: 'Là admin?', required: false })
  @IsOptional()
  isAdmin?: boolean;

  @ApiProperty({ description: 'ID thành viên', required: false })
  @IsOptional()
  @IsUUID()
  memberId?: string;
}

export class UserLoginDto {
  @ApiProperty({ description: 'Email hoặc tên đăng nhập' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: 'Mật khẩu' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserFilterDto {
  @ApiProperty({ description: 'Email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Tên đăng nhập', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'Mã người dùng', required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Là admin?', required: false })
  @IsOptional()
  isAdmin?: boolean;

  @ApiProperty({ description: 'Đã xác thực email?', required: false })
  @IsOptional()
  isVerified?: boolean;
}
