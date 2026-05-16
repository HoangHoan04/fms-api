import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { CreateFundMemberDto } from './fund-member.dto';

export class CreateFundDto {
  @ApiProperty({ description: 'Tên quỹ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Mô tả quỹ' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Số tiền mỗi thành viên đóng mỗi kỳ' })
  @IsNumber()
  @Min(0)
  contributionAmount: number;

  @ApiProperty({ description: 'Loại chu kỳ' })
  @IsString()
  @IsNotEmpty()
  cycleType: string;

  @ApiPropertyOptional({ description: 'Số ngày mỗi chu kỳ ' })
  @IsOptional()
  @IsNumber()
  cycleDurationDays?: number;

  @ApiPropertyOptional({ description: 'Số thành viên tối đa được nhận' })
  @IsOptional()
  @IsNumber()
  maxRecipientPerCycle?: number;

  @ApiPropertyOptional({ description: 'Tổng số thành viên dự kiến' })
  @IsOptional()
  @IsNumber()
  totalMembers?: number;

  @ApiPropertyOptional({ description: 'Ngày bắt đầu' })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Ngày kết thúc dự kiến' })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'ID nhân viên quản lý quỹ' })
  @IsOptional()
  @IsUUID()
  managedBy?: string;

  @ApiPropertyOptional({ description: 'Danh sách thành viên tham ' })
  @IsOptional()
  @IsArray()
  fundMembers?: CreateFundMemberDto[];
}

export class UpdateFundDto extends CreateFundDto {
  @ApiProperty({ description: 'ID quỹ' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterFundDto {
  @ApiPropertyOptional({ description: 'Mã quỹ' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Tên quỹ' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Trạng thái' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Trạng thái xóa mềm' })
  @IsOptional()
  isDeleted?: boolean;
}
