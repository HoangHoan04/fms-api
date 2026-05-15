import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CheckPhoneAndEmailDto {
  @ApiProperty({ description: 'Số điện thoại thành viên' })
  phone: string;

  @ApiProperty({ description: 'Email thành viên' })
  email?: string;
}

export class SendOtpMemberDto {
  @ApiProperty({ description: 'Số điện thoại' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Phương thức gửi (EMAIL hoặc SMS)' })
  @IsString()
  @IsNotEmpty()
  sendMethod: string;
}

export class SendOtpVerifyDto {
  @ApiProperty({ description: 'Email hoặc Số điện thoại' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ description: 'Phương thức gửi (EMAIL hoặc SMS)' })
  @IsString()
  @IsNotEmpty()
  method: string;
}

export class VerifyLoginOtpDto {
  @ApiProperty({ description: 'Email hoặc Số điện thoại' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ description: 'Mã OTP' })
  @IsString()
  @IsNotEmpty()
  otpCode: string;

  @ApiProperty({ description: 'Phương thức gửi (EMAIL hoặc SMS)' })
  @IsString()
  @IsNotEmpty()
  method: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  sendMethod: string;

  @IsString()
  @IsNotEmpty()
  otpCode: string;
}

export class ForgotPasswordMemberDto {
  @ApiProperty({ description: 'Email hoặc Số điện thoại' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ description: 'Mã OTP' })
  @IsString()
  @IsNotEmpty()
  otpCode: string;

  @ApiProperty({ description: 'Mật khẩu mới' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({ description: 'Phương thức' })
  @IsString()
  @IsNotEmpty()
  method: string;
}
