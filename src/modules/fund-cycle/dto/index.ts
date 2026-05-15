import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateFundCycleDto {
  @ApiProperty({ description: 'ID quỹ' })
  @IsUUID()
  @IsNotEmpty()
  fundId: string;

  @ApiProperty({ description: 'Tên chu kỳ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Số thứ tự chu kỳ' })
  @IsNumber()
  cycleIndex: number;

  @ApiPropertyOptional({ description: 'Ngày bắt đầu thu' })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Hạn chót đóng tiền' })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Ngày giải ngân dự kiến' })
  @IsOptional()
  @IsDateString()
  payoutDate?: Date;

  @ApiProperty({ description: 'Số tiền mỗi thành viên cần đóng' })
  @IsNumber()
  @Min(0)
  contributionAmount: number;

  @ApiPropertyOptional({ description: 'Tổng tiền dự kiến thu' })
  @IsOptional()
  @IsNumber()
  totalExpected?: number;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateFundCycleDto {
  @ApiProperty({ description: 'ID chu kỳ' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ description: 'Tên chu kỳ' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Ngày bắt đầu thu' })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Hạn chót đóng tiền' })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Ngày giải ngân dự kiến' })
  @IsOptional()
  @IsDateString()
  payoutDate?: Date;

  @ApiPropertyOptional({ description: 'Số tiền mỗi thành viên cần đóng' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  contributionAmount?: number;

  @ApiPropertyOptional({ description: 'Tổng tiền dự kiến thu' })
  @IsOptional()
  @IsNumber()
  totalExpected?: number;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class FilterFundCycleDto {
  @ApiPropertyOptional({ description: 'ID quỹ' })
  @IsOptional()
  @IsUUID()
  fundId?: string;

  @ApiPropertyOptional({ description: 'Trạng thái' })
  @IsOptional()
  @IsString()
  status?: string;
}
