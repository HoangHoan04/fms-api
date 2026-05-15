import { enumData } from '@/common/contanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SendOtpDto {
  @ApiProperty({ description: 'Email hoặc số điện thoại' })
  @IsString()
  identifier: string;

  @ApiProperty({
    description: 'Phương thức gửi OTP',
    enum: enumData.OTPSendMethod,
  })
  @IsString()
  method: string;
}

export class GoogleLoginDto {
  @ApiProperty({
    description: 'Google ID Token',
  })
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export class FacebookLoginDto {
  @ApiProperty({
    description: 'Facebook Access Token',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
