import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFundMemberDto {
  @ApiProperty({ description: 'ID quỹ' })
  @IsUUID()
  @IsNotEmpty()
  fundId: string;

  @ApiProperty({ description: 'ID thành viên' })
  @IsUUID()
  @IsNotEmpty()
  memberId: string;

  @ApiPropertyOptional({ description: 'Ngày chính thức tham gia quỹ' })
  @IsOptional()
  @IsString()
  joinDate?: Date;

  @ApiPropertyOptional({ description: 'Ngày rời khỏi quỹ' })
  @IsOptional()
  @IsString()
  leaveDate?: Date;

  @ApiPropertyOptional({ description: 'Ghi chú đặc biệt ' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateFundMemberDto extends CreateFundMemberDto {
  @ApiProperty({ description: 'ID quỹ' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterFundMemberDto {
  @ApiPropertyOptional({ description: 'ID quỹ' })
  @IsOptional()
  @IsUUID()
  fundId?: string;

  @ApiPropertyOptional({ description: 'ID thành viên' })
  @IsOptional()
  @IsUUID()
  memberId?: string;

  @ApiPropertyOptional({ description: 'Trạng thái thành viên trong quỹ' })
  @IsOptional()
  @IsString()
  status?: string;
}
