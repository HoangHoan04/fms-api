import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ActionLogFilterDto {
  @ApiProperty({
    description: 'Tên bảng hoặc đối tượng, VD: MEMBER, FUND',
  })
  @IsOptional()
  @IsString()
  entityName?: string;

  @ApiProperty({
    description: 'ID của bản ghi bị tác động',
  })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiProperty({
    description: 'Loại hành động: CREATE | UPDATE | DELETE | ...',
  })
  @IsOptional()
  @IsString()
  actionType?: string;

  @ApiProperty({
    description: 'ID người thực hiện thao tác',
  })
  @IsOptional()
  @IsString()
  createdById?: string;
}

export class ActionLogCreateDto {
  /** ID người thực hiện thao tác */
  @ApiProperty({ description: 'ID người thực hiện thao tác' })
  @IsNotEmpty()
  @IsString()
  createdById: string;

  /** Mã người thực hiện */
  @ApiProperty({ description: 'Mã người thực hiện thao tác' })
  @IsNotEmpty()
  @IsString()
  createdByCode: string;

  /** Tên người thực hiện */
  @ApiProperty({ description: 'Tên người thực hiện thao tác' })
  @IsNotEmpty()
  @IsString()
  createdByName: string;

  /** Thông tin bổ sung về người thực hiện */
  @ApiProperty({ description: 'Thông tin bổ sung về người thực hiện thao tác' })
  @IsOptional()
  @IsString()
  createdNote?: string;

  /** Loại hành động: CREATE | UPDATE | DELETE | LOGIN | APPROVE | ... */
  @ApiProperty({ description: 'Loại hành động' })
  @IsNotEmpty()
  @IsString()
  actionType: string;

  /** Tên bảng/đối tượng bị tác động, VD: Contributions */
  @ApiProperty({ description: 'Tên bảng hoặc đối tượng bị tác động' })
  @IsNotEmpty()
  @IsString()
  entityName: string;

  /** UUID của bản ghi bị tác động */
  @ApiProperty({ description: 'ID của bản ghi bị tác động' })
  @IsNotEmpty()
  @IsString()
  entityId: string;

  /** Giá trị trước thay đổi (JSON string) */
  @ApiProperty({ description: 'Giá trị trước thay đổi (JSON string)' })
  @IsOptional()
  @IsString()
  oldValue?: string;

  /** Giá trị sau thay đổi (JSON string) */
  @ApiProperty({ description: 'Giá trị sau thay đổi (JSON string)' })
  @IsOptional()
  @IsString()
  newValue?: string;

  /** Địa chỉ IP của người dùng */
  @ApiProperty({ description: 'Địa chỉ IP của người thực hiện thao tác' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  /** Thông tin trình duyệt / thiết bị */
  @ApiProperty({
    description:
      'Thông tin trình duyệt hoặc thiết bị của người thực hiện thao tác',
  })
  @IsOptional()
  @IsString()
  userAgent?: string;
}
