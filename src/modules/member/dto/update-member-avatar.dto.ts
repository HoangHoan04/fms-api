import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMemberAvatarDto {
  @ApiProperty({ description: 'URL ảnh đại diện mới' })
  @IsString()
  @IsNotEmpty()
  avatarUrl: string;
}
