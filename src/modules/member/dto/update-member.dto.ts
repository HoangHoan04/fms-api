import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateMemberDto } from './create-member.dto';

export class UpdateMemberDto extends CreateMemberDto {
  @ApiProperty({ description: 'ID thành viên' })
  @IsUUID()
  id: string;
}
