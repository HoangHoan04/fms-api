import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'Mã role', example: 'ADMIN' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Tên role', example: 'Quản trị viên' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Mô tả vai trò' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRoleDto extends CreateRoleDto {
  @ApiProperty({ description: 'ID vai trò' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterRoleDto {
  @ApiPropertyOptional({ description: 'Mã role' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Tên role' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Trạng thái xóa mềm' })
  @IsOptional()
  isDeleted?: boolean;
}
