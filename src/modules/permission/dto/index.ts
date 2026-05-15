import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
  IsDateString,
} from 'class-validator';
import { PaginationDto } from '@/dto';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Mã quyền' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ description: 'Tên quyền' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Mô tả' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Nhóm chức năng' })
  @IsOptional()
  @IsString()
  module?: string;

  @ApiPropertyOptional({
    description: 'Hành động',
    example: 'create',
  })
  @IsOptional()
  @IsString()
  action?: string;
}

export class UpdatePermissionDto extends CreatePermissionDto {
  @IsUUID()
  id: string;
}

export class AssignPermissionsToRoleDto {
  @ApiProperty({ description: 'ID Role' })
  @IsUUID()
  roleId: string;

  @ApiProperty({
    description: 'Danh sách ID Permission cần gán',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds: string[];
}

export class RemovePermissionFromRoleDto {
  @ApiProperty({ description: 'ID Role' })
  @IsUUID()
  roleId: string;

  @ApiProperty({ description: 'ID Permission cần xóa' })
  @IsUUID()
  permissionId: string;
}

export class AssignPermissionToUserDto {
  @ApiProperty({ description: 'ID người dùng' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'ID quyền' })
  @IsUUID()
  permissionId: string;

  @ApiProperty({ description: 'Loại cấp quyền' })
  @IsString()
  grantType: string;

  @ApiPropertyOptional({ description: 'Lý do cấp/thu hồi' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Thời hạn hết hiệu lực (null = vĩnh viễn)',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
