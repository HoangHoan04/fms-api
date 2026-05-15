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
  AssignPermissionsToRoleDto,
  AssignPermissionToUserDto,
  CreatePermissionDto,
  RemovePermissionFromRoleDto,
  UpdatePermissionDto,
} from './dto';
import { PermissionService } from './permission.service';
import { ModuleDiscoveryService } from './services/module-discovery.service';

@ApiTags('Permission')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
@RequireRoles('ADMIN')
@Controller('permission')
export class PermissionController {
  constructor(
    private readonly service: PermissionService,
    private readonly moduleDiscoveryService: ModuleDiscoveryService,
  ) {}

  @ApiOperation({ summary: 'Phân trang quyền' })
  @RequirePermissions(['PERMISSION:VIEW_LIST'])
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Chi tiết quyền' })
  @RequirePermissions(['PERMISSION:VIEW_DETAIL'])
  @Post('find-by-id')
  async findById(@Body() data: IdDto) {
    return await this.service.findById(data);
  }

  @ApiOperation({ summary: 'Danh sách quyền cho selectbox' })
  @RequirePermissions(['PERMISSION:VIEW_LIST'])
  @Post('select-box')
  async selectbox() {
    return await this.service.selectbox();
  }

  @ApiOperation({ summary: 'Tạo mới quyền' })
  @RequirePermissions(['PERMISSION:CREATED'])
  @Post('create')
  async create(
    @Body() data: CreatePermissionDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.create(data, user);
  }

  @ApiOperation({ summary: 'Cập nhật quyền' })
  @RequirePermissions(['PERMISSION:EDITED'])
  @Post('update')
  async update(
    @Body() data: UpdatePermissionDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.update(data, user);
  }

  @ApiOperation({ summary: 'Ngưng hoạt động quyền' })
  @RequirePermissions(['PERMISSION:DEACTIVATED'])
  @Post('deactivate')
  async deactivate(@Body() data: { id: string }, @CurrentUser() user: UserDto) {
    return await this.service.deactivate(data.id, user);
  }

  @ApiOperation({ summary: 'Kích hoạt lại quyền' })
  @RequirePermissions(['PERMISSION:ACTIVATED'])
  @Post('activate')
  async activate(@Body() data: { id: string }, @CurrentUser() user: UserDto) {
    return await this.service.activate(data.id, user);
  }

  @ApiOperation({ summary: 'Lấy danh sách quyền của vai trò' })
  @RequirePermissions(['PERMISSION:VIEW_LIST'])
  @Post('get-permission-by-role')
  async getPermissionsByRole(@Body() data: { roleId: string }) {
    return await this.service.getPermissionsByRole(data.roleId);
  }

  @ApiOperation({ summary: 'Gán quyền cho vai trò' })
  @RequirePermissions(['PERMISSION:ASSIGN'])
  @Post('assign-to-role')
  async assignPermissionsToRole(
    @Body() data: AssignPermissionsToRoleDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.assignPermissionsToRole(data, user);
  }

  @ApiOperation({ summary: 'Xóa quyền khỏi vai trò' })
  @RequirePermissions(['PERMISSION:ASSIGN'])
  @Post('remove-from-role')
  async removePermissionFromRole(
    @Body() data: RemovePermissionFromRoleDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.removePermissionFromRole(data, user);
  }

  @ApiOperation({ summary: 'Lấy danh sách quyền đặc biệt của người dùng' })
  @RequirePermissions(['PERMISSION:VIEW_LIST'])
  @Post('get-permission-by-user')
  async getPermissionsByUser(@Body() data: { userId: string }) {
    return await this.service.getPermissionsByUser(data.userId);
  }

  @ApiOperation({ summary: 'Gán/Cập nhật quyền đặc biệt cho người dùng' })
  @RequirePermissions(['PERMISSION:ASSIGN'])
  @Post('assign-to-user')
  async assignPermissionToUser(
    @Body() data: AssignPermissionToUserDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.assignPermissionToUser(data, user);
  }

  @ApiOperation({ summary: 'Thu hồi quyền đặc biệt của người dùng' })
  @RequirePermissions(['PERMISSION:ASSIGN'])
  @Post('remove-from-user')
  async removeUserPermission(
    @Body() data: { id: string },
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.removeUserPermission(data.id, user);
  }

  @ApiOperation({ summary: 'Lấy danh sách module và action có sẵn' })
  @RequirePermissions(['PERMISSION:VIEW_LIST'])
  @Post('get-module-actions')
  async getModuleActions() {
    return await this.moduleDiscoveryService.getModuleActions();
  }

  @ApiOperation({ summary: 'Tự động đồng bộ quyền từ các controller' })
  @RequirePermissions(['PERMISSION:CREATED'])
  @Post('sync-permissions')
  async syncPermissions(@CurrentUser() user: UserDto) {
    return await this.moduleDiscoveryService.syncPermissions(user.id);
  }
}
