import {
  CurrentUser,
  RequirePermissions,
  RequireRoles,
} from '@/common/decorators';
import { JwtAuthGuard, PermissionGuard, RoleGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateEmployeeDto,
  UpdateEmployeeAvatarDto,
  UpdateEmployeeDto,
} from './dto';
import { EmployeeService } from './employee.service';

@ApiTags('Employee')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['EMPLOYEE:VIEW_LIST'])
  @ApiOperation({ summary: 'Phân trang nhân viên' })
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['EMPLOYEE:VIEW_DETAIL'])
  @ApiOperation({ summary: 'Chi tiết nhân viên' })
  @Post('find-by-id')
  async findById(@Body() data: IdDto) {
    return await this.service.findById(data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['EMPLOYEE:VIEW_LIST'])
  @ApiOperation({ summary: 'Danh sách cho selectbox' })
  @Post('selectbox')
  async selectbox() {
    return await this.service.selectBox();
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['EMPLOYEE:CREATED'])
  @ApiOperation({ summary: 'Tạo nhân viên' })
  @Post('create')
  async create(@Body() data: CreateEmployeeDto, @CurrentUser() user: UserDto) {
    return await this.service.create(user, data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['EMPLOYEE:EDITED'])
  @ApiOperation({ summary: 'Cập nhật nhân viên' })
  @Post('update')
  async update(@Body() data: UpdateEmployeeDto, @CurrentUser() user: UserDto) {
    return await this.service.update(user, data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['EMPLOYEE:DEACTIVATED'])
  @ApiOperation({ summary: 'Ngừng hoạt động nhân viên' })
  @Post('deactivate')
  async deactivate(@Body() data: { id: string }, @CurrentUser() user: UserDto) {
    return await this.service.deactivate(user, data.id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['EMPLOYEE:ACTIVATED'])
  @ApiOperation({ summary: 'Kích hoạt nhân viên' })
  @Post('activate')
  async activate(@Body() data: { id: string }, @CurrentUser() user: UserDto) {
    return await this.service.activate(user, data.id);
  }

  @ApiOperation({ summary: 'Cập nhật Profile cá nhân' })
  @Post('update-profile')
  async updateProfile(
    @Body() data: UpdateEmployeeDto,
    @CurrentUser() user: UserDto,
  ) {
    if (!user.employeeId)
      throw new NotFoundException('Không tìm thấy profile nhân viên');
    return await this.service.update(user, { ...data, id: user.employeeId });
  }

  @ApiOperation({ summary: 'Cập nhật ảnh đại diện' })
  @Post('update-avatar')
  async updateAvatar(
    @Body() data: UpdateEmployeeAvatarDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.updateAvatar(user, data);
  }
}
