import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateReceiptDto {
  @ApiProperty({ description: 'ID chu kỳ' })
  @IsUUID()
  @IsNotEmpty()
  cycleId: string;

  @ApiProperty({ description: 'ID thành viên trong quỹ' })
  @IsUUID()
  @IsNotEmpty()
  fundMemberId: string;

  @ApiPropertyOptional({ description: 'Lý do xin nhận tiền' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ description: 'Số tiền đề nghị nhận' })
  @IsNumber()
  @Min(0)
  requestedAmount: number;

  @ApiPropertyOptional({ description: 'Mức ưu tiên', default: 0 })
  @IsOptional()
  @IsNumber()
  priority?: number;

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
}

export class ApproveReceiptDto {
  @ApiProperty({ description: 'ID đơn đăng ký' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Số tiền được duyệt' })
  @IsNumber()
  @Min(0)
  approvedAmount: number;

  @ApiPropertyOptional({ description: 'Nhận xét' })
  @IsOptional()
  @IsString()
  reviewNote?: string;
}

export class RejectReceiptDto {
  @ApiProperty({ description: 'ID đơn đăng ký' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Lý do từ chối' })
  @IsString()
  @IsNotEmpty()
  rejectedReason: string;
}

export class FilterReceiptDto {
  @ApiPropertyOptional({ description: 'ID chu kỳ' })
  @IsOptional()
  @IsUUID()
  cycleId?: string;

  @ApiPropertyOptional({ description: 'ID thành viên' })
  @IsOptional()
  @IsUUID()
  fundMemberId?: string;

  @ApiPropertyOptional({ description: 'Trạng thái' })
  @IsOptional()
  @IsString()
  status?: string;
}
