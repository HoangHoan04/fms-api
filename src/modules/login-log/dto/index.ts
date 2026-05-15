import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterLoginLogDto {
  @ApiPropertyOptional({ description: 'ID người dùng' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Loại người dùng' })
  @IsOptional()
  @IsString()
  actorType?: string;

  @ApiPropertyOptional({ description: 'Kết quả: success | failed | blocked' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Phương thức đăng nhập' })
  @IsOptional()
  @IsString()
  loginProvider?: string;
}
