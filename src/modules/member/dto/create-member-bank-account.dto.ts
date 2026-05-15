import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class QrCodeDto {
  @ApiProperty({ description: 'URL file ảnh QR' })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiPropertyOptional({ description: 'Tên file ảnh QR' })
  @IsString()
  @IsOptional()
  fileName?: string;
}

export class CreateMemberBankAccountDto {
  @ApiPropertyOptional({ description: 'Tên ngân hàng, VD: Vietcombank' })
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiPropertyOptional({ description: 'Số tài khoản ngân hàng' })
  @IsString()
  @IsOptional()
  bankAccountNo?: string;

  @ApiPropertyOptional({ description: 'Tên chủ tài khoản' })
  @IsString()
  @IsOptional()
  bankAccountName?: string;

  @ApiPropertyOptional({ description: 'QR code của tài khoản' })
  @ValidateNested()
  @Type(() => QrCodeDto)
  @IsOptional()
  qrCode?: QrCodeDto;
}
