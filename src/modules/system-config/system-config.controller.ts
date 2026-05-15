import { RequirePermissions, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard, PermissionGuard, RoleGuard } from '@/common/guards';
import { PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSystemConfigDto, UpdateSystemConfigDto } from './dto';
import { SystemConfigService } from './system-config.service';

@ApiTags('SystemConfig')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
@RequireRoles('ADMIN')
@Controller('system-config')
export class SystemConfigController {
  constructor(private readonly service: SystemConfigService) {}

  @ApiOperation({ summary: 'Phân trang cấu hình' })
  @RequirePermissions(['SYSTEM_CONFIG:VIEW_LIST'])
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Chi tiết cấu hình' })
  @RequirePermissions(['SYSTEM_CONFIG:VIEW_DETAIL'])
  @Post('find-by-id')
  async findById(@Body() data: { id: string }) {
    return await this.service.findById(data.id);
  }

  @ApiOperation({ summary: 'Danh sách cho selectbox' })
  @RequirePermissions(['SYSTEM_CONFIG:VIEW_LIST'])
  @Post('selectbox')
  async selectbox() {
    return await this.service.selectbox();
  }

  @ApiOperation({ summary: 'Tạo cấu hình' })
  @RequirePermissions(['SYSTEM_CONFIG:CREATED'])
  @Post('create')
  async create(@Body() data: CreateSystemConfigDto) {
    return await this.service.create(data);
  }

  @ApiOperation({ summary: 'Cập nhật cấu hình' })
  @RequirePermissions(['SYSTEM_CONFIG:EDITED'])
  @Post('update')
  async update(@Body() data: UpdateSystemConfigDto) {
    return await this.service.update(data);
  }
}
