import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateMemberBankAccountDto } from './create-member-bank-account.dto';

export class UpdateMemberBankAccountDto extends CreateMemberBankAccountDto {
  @ApiProperty({ description: 'ID tài khoản ngân hàng' })
  @IsUUID()
  id: string;
}
