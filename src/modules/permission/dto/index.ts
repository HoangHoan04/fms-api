import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Mã quyền', example: 'MEMBER:CREATED' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({
    description: 'Tên quyền',
    example: 'Thêm mới thành viên',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Mô tả quyền' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Nhóm chức năng', example: 'Member' })
  @IsOptional()
  @IsString()
  module?: string;

  @ApiPropertyOptional({ description: 'Hành động', example: 'CREATED' })
  @IsOptional()
  @IsString()
  action?: string;
}

export class UpdatePermissionDto extends CreatePermissionDto {
  @ApiProperty({ description: 'ID quyền' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class AssignPermissionsToRoleDto {
  @ApiProperty({ description: 'ID Role' })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({
    description: 'Danh sách ID Permission cần gán',
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  permissionIds: string[];
}

export class RemovePermissionFromRoleDto {
  @ApiProperty({ description: 'ID Role' })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({ description: 'ID Permission cần xóa' })
  @IsUUID()
  @IsNotEmpty()
  permissionId: string;
}

export class AssignPermissionToUserDto {
  @ApiProperty({ description: 'ID người dùng' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'ID quyền' })
  @IsUUID()
  @IsNotEmpty()
  permissionId: string;

  @ApiProperty({
    description: 'Loại cấp quyền: Allow hoặc Deny',
    enum: ['Allow', 'Deny'],
  })
  @IsString()
  @IsIn(['Allow', 'Deny'])
  @IsNotEmpty()
  grantType: string;

  @ApiPropertyOptional({ description: 'Lý do cấp/thu hồi quyền' })
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

export class FilterPermissionDto {
  @ApiPropertyOptional({ description: 'Mã quyền' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Tên quyền' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Nhóm chức năng' })
  @IsOptional()
  @IsString()
  module?: string;

  @ApiPropertyOptional({ description: 'Trạng thái xóa mềm' })
  @IsOptional()
  isDeleted?: boolean;
}
