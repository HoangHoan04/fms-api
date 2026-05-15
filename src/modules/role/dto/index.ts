import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from '@/dto';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Mã role',
    enum: ['ADMIN', 'TEACHER', 'STUDENT', 'MODERATOR'],
  })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Tên role' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Mô tả' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRoleDto extends CreateRoleDto {
  @IsUUID()
  id: string;
}
