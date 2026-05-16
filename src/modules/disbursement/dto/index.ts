import { FileDto } from '@/dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateDisbursementDto {
  @ApiProperty({ description: 'ID đơn đăng ký' })
  @IsUUID()
  @IsNotEmpty()
  receiptId: string;

  @ApiProperty({ description: 'ID chu kỳ' })
  @IsUUID()
  @IsNotEmpty()
  cycleId: string;

  @ApiProperty({ description: 'Số tiền giải ngân' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ description: 'Phương thức thanh toán' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Mã giao dịch' })
  @IsOptional()
  @IsString()
  transactionRef?: string;

  @ApiPropertyOptional({ description: 'File chứng từ' })
  @IsOptional()
  proofFile?: FileDto[];

  @ApiPropertyOptional({ description: 'Ngân hàng nhận' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ description: 'Số tài khoản nhận' })
  @IsOptional()
  @IsString()
  bankAccountNo?: string;

  @ApiPropertyOptional({ description: 'Tên chủ tài khoản' })
  @IsOptional()
  @IsString()
  bankAccountName?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class ConfirmDisbursementDto {
  @ApiProperty({ description: 'ID phiếu giải ngân' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ description: 'File chứng từ xác nhận' })
  @IsOptional()
  proofFile?: FileDto[];

  @ApiPropertyOptional({ description: 'Ghi chú xác nhận' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class FilterDisbursementDto {
  @ApiPropertyOptional({ description: 'ID chu kỳ' })
  @IsOptional()
  @IsUUID()
  cycleId?: string;

  @ApiPropertyOptional({ description: 'ID đơn đăng ký' })
  @IsOptional()
  @IsUUID()
  receiptId?: string;

  @ApiPropertyOptional({ description: 'Phương thức thanh toán' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
