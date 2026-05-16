import { FileDto } from '@/dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateMemberBankAccountDto } from './member-bank-account.dto';

export class CreateMemberDto {
  @ApiProperty({ description: 'Họ tên đầy đủ của thành viên' })
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({
    description: 'Tên gọi ngắn hoặc biệt danh của thành viên',
  })
  @IsOptional()
  shortName?: string;

  @ApiProperty({ description: 'Email liên hệ của thành viên' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Số điện thoại liên hệ của thành viên' })
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ description: 'Giới tính của thành viên' })
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ description: 'Ngày sinh của thành viên' })
  @IsOptional()
  birthday?: Date;

  @ApiPropertyOptional({ description: 'Ghi chú thêm về thành viên' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Danh sách tài khoản ngân hàng',
    type: [CreateMemberBankAccountDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMemberBankAccountDto)
  @IsOptional()
  bankAccounts?: CreateMemberBankAccountDto[];

  @ApiPropertyOptional({ description: 'URL avatar của thành viên' })
  @IsOptional()
  avatar?: FileDto[];
}

export class UpdateMemberDto extends CreateMemberDto {
  @ApiProperty({ description: 'ID thành viên' })
  @IsUUID()
  id: string;
}

export class FilterMemberDto {
  @ApiPropertyOptional({ description: 'Mã thành viên' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Tên thành viên' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Giới tính' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Trạng thái' })
  @IsOptional()
  isDeleted?: boolean;
}
