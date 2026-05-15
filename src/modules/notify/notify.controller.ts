import {
  CurrentUser,
  RequirePermissions,
  RequireRoles,
} from '@/common/decorators';
import { JwtAuthGuard, PermissionGuard, RoleGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateNotificationDto,
  CreateNotifyAdminDto,
  CreateNotifyForUsersDto,
  CreateTemplateDto,
  MarkAsReadDto,
  RenderTemplateDto,
  SendFromTemplateDto,
  UpdateTemplateDto,
} from './dto';
import { NotifyService } from './notify.service';

@ApiTags('Notify')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notify')
export class NotifyController {
  constructor(private readonly service: NotifyService) {}

  // ===== NOTIFICATIONS =====

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['NOTIFICATION:CREATED'])
  @ApiOperation({ summary: 'Tạo thông báo cho người dùng' })
  @Post('create')
  async create(@Body() data: CreateNotificationDto) {
    return await this.service.create(data);
  }

  @ApiOperation({ summary: 'Chi tiết thông báo' })
  @Post('find-by-id')
  async findById(@Body() data: IdDto) {
    return await this.service.findById(data);
  }

  @ApiOperation({ summary: 'Danh sách thông báo phân trang' })
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Đếm số thông báo chưa đọc' })
  @Post('count-unread')
  async countUnread(@CurrentUser() user: UserDto) {
    return await this.service.countUnread(user);
  }

  @ApiOperation({ summary: 'Đánh dấu đã đọc một thông báo' })
  @Post('mark-as-read')
  async markAsRead(@Body() data: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.markAsRead(data.id, user);
  }

  @ApiOperation({ summary: 'Đánh dấu tất cả thông báo đã đọc' })
  @Post('mark-all-as-read')
  async markAllAsRead(@CurrentUser() user: UserDto) {
    return await this.service.markAllAsRead(user);
  }

  @ApiOperation({ summary: 'Đánh dấu danh sách thông báo đã đọc' })
  @Post('mark-list-as-read')
  async markListAsRead(
    @CurrentUser() user: UserDto,
    @Body() data: MarkAsReadDto,
  ) {
    return await this.service.markListAsRead(user, data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['NOTIFICATION:DELETED'])
  @ApiOperation({ summary: 'Xóa mềm thông báo' })
  @Post('delete')
  async softDelete(@Body() data: IdDto) {
    return await this.service.softDelete(data.id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['NOTIFICATION:CREATED'])
  @ApiOperation({ summary: 'Gửi thông báo cho tất cả admin' })
  @Post('create-for-admin')
  async createNotifyAdmin(@Body() data: CreateNotifyAdminDto) {
    return await this.service.createNotifyAdmin(data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['NOTIFICATION:CREATED'])
  @ApiOperation({ summary: 'Gửi thông báo cho danh sách người dùng' })
  @Post('create-for-users')
  async createNotifyForUsers(@Body() data: CreateNotifyForUsersDto) {
    return await this.service.createNotifyForUsers(data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['NOTIFICATION:CREATED'])
  @ApiOperation({ summary: 'Gửi thông báo từ mẫu có sẵn' })
  @Post('send-from-template')
  async sendFromTemplate(@Body() data: SendFromTemplateDto) {
    return await this.service.sendFromTemplate(data);
  }

  // ===== TEMPLATES =====

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['NOTIFICATION:CREATED'])
  @ApiOperation({ summary: 'Tạo mẫu thông báo' })
  @Post('create-template')
  async createTemplate(@Body() data: CreateTemplateDto) {
    return await this.service.createTemplate(data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['NOTIFICATION:EDITED'])
  @ApiOperation({ summary: 'Cập nhật mẫu thông báo' })
  @Post('update-template')
  async updateTemplate(@Body() data: UpdateTemplateDto) {
    return await this.service.updateTemplate(data);
  }

  @ApiOperation({ summary: 'Chi tiết mẫu thông báo' })
  @Post('find-template-by-id')
  async findTemplateById(@Body() data: IdDto) {
    return await this.service.findTemplateById(data);
  }

  @ApiOperation({ summary: 'Tìm mẫu thông báo theo code' })
  @Post('find-template-by-code')
  async findTemplateByCode(@Body() data: { code: string }) {
    return await this.service.findTemplateByCode(data.code);
  }

  @ApiOperation({ summary: 'Danh sách mẫu thông báo phân trang' })
  @Post('pagination-template')
  async paginationTemplate(@Body() data: PaginationDto) {
    return await this.service.paginationTemplate(data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['NOTIFICATION:DELETED'])
  @ApiOperation({ summary: 'Xóa mềm mẫu thông báo' })
  @Post('delete-template')
  async deleteTemplate(@Body() data: IdDto) {
    return await this.service.deleteTemplate(data.id);
  }

  @ApiOperation({ summary: 'Render thử mẫu thông báo với biến' })
  @Post('render-template')
  async renderTemplate(@Body() data: RenderTemplateDto) {
    return await this.service.renderTemplate(data);
  }
}
