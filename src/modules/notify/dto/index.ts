import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID người nhận' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'ID mẫu thông báo (nếu dùng template)' })
  @IsUUID()
  @IsOptional()
  templateId?: string;

  @ApiProperty({ description: 'Tiêu đề thông báo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Nội dung thông báo' })
  @IsString()
  @IsOptional()
  body?: string;

  @ApiPropertyOptional({
    description: 'Dữ liệu bổ sung JSON: {"receiptId":"...","cycleId":"..."}',
  })
  @IsOptional()
  payload?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Kênh gửi: email | sms | push' })
  @IsString()
  @IsOptional()
  channel?: string;

  @ApiPropertyOptional({ description: 'Loại đối tượng liên quan' })
  @IsString()
  @IsOptional()
  relatedEntityType?: string;

  @ApiPropertyOptional({ description: 'UUID đối tượng liên quan' })
  @IsUUID()
  @IsOptional()
  relatedEntityId?: string;
}

export class CreateNotifyAdminDto {
  @ApiProperty({ description: 'Tiêu đề thông báo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Tiêu đề (tiếng Anh)' })
  @IsString()
  @IsOptional()
  titleEn?: string;

  @ApiProperty({ description: 'Nội dung thông báo' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Nội dung (tiếng Anh)' })
  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @ApiProperty({ description: 'Danh mục, VD: AUTH | PAYMENT | SYSTEM' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ description: 'Màu sắc hiển thị' })
  @IsString()
  @IsOptional()
  colorType?: string;

  @ApiPropertyOptional({ description: 'URL callback khi click' })
  @IsString()
  @IsOptional()
  callbackUrl?: string;

  @ApiPropertyOptional({ description: 'Quyền nhận thông báo' })
  @IsString()
  @IsOptional()
  notifyPermissionType?: string;
}

export class CreateNotifyForUsersDto {
  @ApiProperty({ description: 'Tiêu đề thông báo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Nội dung thông báo' })
  @IsString()
  @IsOptional()
  body?: string;

  @ApiProperty({ description: 'Danh sách user ID người nhận' })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty({ each: true })
  userIds: string[];

  @ApiPropertyOptional({ description: 'Kênh gửi: email | sms | push' })
  @IsString()
  @IsOptional()
  channel?: string;

  @ApiPropertyOptional({ description: 'Dữ liệu bổ sung JSON' })
  @IsOptional()
  payload?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Loại đối tượng liên quan' })
  @IsString()
  @IsOptional()
  relatedEntityType?: string;

  @ApiPropertyOptional({ description: 'UUID đối tượng liên quan' })
  @IsUUID()
  @IsOptional()
  relatedEntityId?: string;
}

export class FilterNotificationDto {
  @ApiPropertyOptional({ description: 'ID người nhận' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Đã đọc chưa' })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @ApiPropertyOptional({ description: 'Kênh gửi' })
  @IsString()
  @IsOptional()
  channel?: string;

  @ApiPropertyOptional({ description: 'Loại đối tượng liên quan' })
  @IsString()
  @IsOptional()
  relatedEntityType?: string;

  @ApiPropertyOptional({ description: 'ID đối tượng liên quan' })
  @IsUUID()
  @IsOptional()
  relatedEntityId?: string;
}

export class CreateTemplateDto {
  @ApiProperty({ description: 'Mã mẫu, VD: CONTRIBUTION_REMINDER' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Tiêu đề mẫu (hỗ trợ biến {{name}})' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Nội dung mẫu (hỗ trợ biến {{amount}})' })
  @IsString()
  @IsOptional()
  body?: string;

  @ApiPropertyOptional({ description: 'Kênh gửi mặc định' })
  @IsString()
  @IsOptional()
  channel?: string;

  @ApiPropertyOptional({ description: 'Loại sự kiện kích hoạt' })
  @IsString()
  @IsOptional()
  eventType?: string;
}

export class UpdateTemplateDto {
  @ApiProperty({ description: 'ID mẫu thông báo' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ description: 'Mã mẫu' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: 'Tiêu đề mẫu' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Nội dung mẫu' })
  @IsString()
  @IsOptional()
  body?: string;

  @ApiPropertyOptional({ description: 'Kênh gửi mặc định' })
  @IsString()
  @IsOptional()
  channel?: string;

  @ApiPropertyOptional({ description: 'Loại sự kiện kích hoạt' })
  @IsString()
  @IsOptional()
  eventType?: string;
}

export class FilterTemplateDto {
  @ApiPropertyOptional({ description: 'Mã mẫu' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: 'Loại sự kiện' })
  @IsString()
  @IsOptional()
  eventType?: string;

  @ApiPropertyOptional({ description: 'Trạng thái xóa' })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}

export class MarkAsReadDto {
  @ApiProperty({ description: 'Danh sách ID thông báo cần đánh dấu đã đọc' })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  ids: string[];
}

export class SendFromTemplateDto {
  @ApiProperty({ description: 'Mã mẫu thông báo' })
  @IsString()
  @IsNotEmpty()
  templateCode: string;

  @ApiProperty({ description: 'Danh sách user ID người nhận' })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty({ each: true })
  userIds: string[];

  @ApiProperty({
    description: 'Biến để render template, VD: {"name":"John","amount":500000}',
  })
  @IsNotEmpty()
  variables: Record<string, any>;

  @ApiPropertyOptional({ description: 'Dữ liệu bổ sung JSON' })
  @IsOptional()
  payload?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Loại đối tượng liên quan' })
  @IsString()
  @IsOptional()
  relatedEntityType?: string;

  @ApiPropertyOptional({ description: 'UUID đối tượng liên quan' })
  @IsUUID()
  @IsOptional()
  relatedEntityId?: string;
}

export class RenderTemplateDto {
  @ApiProperty({ description: 'Mã mẫu thông báo' })
  @IsString()
  @IsNotEmpty()
  templateCode: string;

  @ApiProperty({ description: 'Biến để render' })
  @IsNotEmpty()
  variables: Record<string, any>;
}
