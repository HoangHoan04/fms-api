import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ActionLogFilterDto {
  @ApiProperty({ description: 'ID người thực hiện', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    description: 'Loại hành động: CREATE | UPDATE | DELETE | LOGIN | APPROVE',
    required: false,
  })
  @IsOptional()
  @IsString()
  actionType?: string;

  @ApiProperty({ description: 'Tên bảng/đối tượng', required: false })
  @IsOptional()
  @IsString()
  entityName?: string;

  @ApiProperty({ description: 'UUID của bản ghi', required: false })
  @IsOptional()
  @IsUUID()
  entityId?: string;
}

export class ActionLogCreateDto {
  @ApiProperty({ description: 'ID người thực hiện thao tác' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Loại hành động' })
  @IsString()
  actionType: string;

  @ApiProperty({ description: 'Tên bảng/đối tượng bị tác động' })
  @IsString()
  entityName: string;

  @ApiProperty({ description: 'UUID của bản ghi bị tác động' })
  @IsUUID()
  entityId: string;

  @ApiProperty({ description: 'Giá trị trước thay đổi', required: false })
  @IsOptional()
  @IsString()
  oldValue?: string;

  @ApiProperty({ description: 'Giá trị sau thay đổi', required: false })
  @IsOptional()
  @IsString()
  newValue?: string;

  @ApiProperty({ description: 'Địa chỉ IP', required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({ description: 'Thông tin trình duyệt', required: false })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({ description: 'Mô tả hành động', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
