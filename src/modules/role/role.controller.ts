import {
  CurrentUser,
  RequirePermissions,
  RequireRoles,
} from '@/common/decorators';
import { JwtAuthGuard, PermissionGuard, RoleGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { RoleService } from './role.service';

@ApiTags('Role')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
@RequireRoles('ADMIN')
@Controller('role')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @ApiOperation({ summary: 'Phân trang vai trò' })
  @RequirePermissions(['ROLE:VIEW_LIST'])
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Chi tiết vai trò' })
  @RequirePermissions(['ROLE:VIEW_DETAIL'])
  @Post('find-by-id')
  async findById(@Body() data: IdDto) {
    return await this.service.findById(data);
  }

  @ApiOperation({ summary: 'Danh sách cho selectbox' })
  @RequirePermissions(['ROLE:VIEW_LIST'])
  @Post('select-box')
  async selectbox() {
    return await this.service.selectbox();
  }

  @ApiOperation({ summary: 'Tạo mới vai trò' })
  @RequirePermissions(['ROLE:CREATED'])
  @Post('create')
  async create(@Body() data: CreateRoleDto, @CurrentUser() user: UserDto) {
    return await this.service.create(data, user);
  }

  @ApiOperation({ summary: 'Cập nhật vai trò' })
  @RequirePermissions(['ROLE:EDITED'])
  @Post('update')
  async update(@Body() data: UpdateRoleDto, @CurrentUser() user: UserDto) {
    return await this.service.update(data, user);
  }

  @ApiOperation({ summary: 'Ngưng hoạt động vai trò' })
  @RequirePermissions(['ROLE:DEACTIVATED'])
  @Post('deactivate')
  async deactivate(@Body() data: { id: string }, @CurrentUser() user: UserDto) {
    return await this.service.deactivate(user, data.id);
  }

  @ApiOperation({ summary: 'Kích hoạt lại vai trò' })
  @RequirePermissions(['ROLE:ACTIVATED'])
  @Post('activate')
  async activate(@Body() data: { id: string }, @CurrentUser() user: UserDto) {
    return await this.service.activate(user, data.id);
  }
}
