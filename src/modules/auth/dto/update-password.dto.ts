import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ description: 'Mật khẩu hiện tại' })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'Mật khẩu mới' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({ description: 'Xác nhận mật khẩu mới' })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
