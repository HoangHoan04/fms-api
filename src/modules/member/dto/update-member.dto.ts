import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateMemberDto } from './create-member.dto';

export class UpdateMemberDto extends CreateMemberDto {
  @ApiProperty({ description: 'ID thành viên' })
  id: string;
}

export class UpdateMemberAvatarDto {
  @ApiProperty({ description: 'url avatar' })
  @IsString()
  avatarUrl: string;
}
