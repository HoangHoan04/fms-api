import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateContributionDto {
  @ApiProperty({ description: 'ID chu kỳ' })
  @IsUUID()
  @IsNotEmpty()
  cycleId: string;

  @ApiProperty({ description: 'ID thành viên trong quỹ' })
  @IsUUID()
  @IsNotEmpty()
  fundMemberId: string;

  @ApiProperty({ description: 'Số tiền đóng' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Số tiền yêu cầu' })
  @IsNumber()
  @Min(0)
  requiredAmount: number;

  @ApiPropertyOptional({ description: 'Hạn đóng tiền' })
  @IsOptional()
  dueDate?: Date;

  @ApiPropertyOptional({ description: 'Phương thức thanh toán' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Mã giao dịch tham chiếu' })
  @IsOptional()
  @IsString()
  transactionRef?: string;

  @ApiPropertyOptional({ description: 'ID file chứng từ' })
  @IsOptional()
  @IsUUID()
  proofFileId?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateContributionDto {
  @ApiProperty({ description: 'ID khoản đóng' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ description: 'Số tiền đóng' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({ description: 'Phương thức thanh toán' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Mã giao dịch tham chiếu' })
  @IsOptional()
  @IsString()
  transactionRef?: string;

  @ApiPropertyOptional({ description: 'ID file chứng từ' })
  @IsOptional()
  @IsUUID()
  proofFileId?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class ConfirmContributionDto {
  @ApiProperty({ description: 'ID khoản đóng' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ description: 'Số tiền thực nhận (mặc định = requiredAmount)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({ description: 'Phương thức thanh toán' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Mã giao dịch' })
  @IsOptional()
  @IsString()
  transactionRef?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class FilterContributionDto {
  @ApiPropertyOptional({ description: 'ID chu kỳ' })
  @IsOptional()
  @IsUUID()
  cycleId?: string;

  @ApiPropertyOptional({ description: 'ID thành viên trong quỹ' })
  @IsOptional()
  @IsUUID()
  fundMemberId?: string;

  @ApiPropertyOptional({ description: 'Trạng thái' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Đóng trễ hạn' })
  @IsOptional()
  isLate?: boolean;
}
