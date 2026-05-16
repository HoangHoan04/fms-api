import { FileDto } from '@/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

export class CreateMemberBankAccountDto {
  @ApiProperty({ description: 'Tên ngân hàng, VD: Vietcombank' })
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiProperty({ description: 'Số tài khoản ngân hàng' })
  @IsString()
  @IsOptional()
  bankAccountNo?: string;

  @ApiProperty({ description: 'Tên chủ tài khoản' })
  @IsString()
  @IsOptional()
  bankAccountName?: string;

  @ApiProperty({ description: 'QR code của tài khoản' })
  @ValidateNested()
  @IsOptional()
  qrCode?: FileDto;
}

export class UpdateMemberBankAccountDto extends CreateMemberBankAccountDto {
  @ApiProperty({ description: 'ID tài khoản ngân hàng' })
  @IsUUID()
  id: string;
}
