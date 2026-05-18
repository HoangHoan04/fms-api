import { ApiProperty } from '@nestjs/swagger';

export class CheckPhoneAndEmailDto {
  @ApiProperty({ description: 'Số điện thoại thành viên' })
  phone: string;

  @ApiProperty({ description: 'Email thành viên' })
  email?: string;
}

export class ForgotPasswordMemberDto {}
