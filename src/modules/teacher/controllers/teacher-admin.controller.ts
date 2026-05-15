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
} from '../dto';
import { EmployeeService } from '../employee.service';

@ApiTags('Employee')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('employee')
export class AdminEmployeeController {
  constructor(private readonly service: EmployeeService) {}

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['TEACHER:VIEW_LIST'])
  @ApiOperation({ summary: 'Phân trang giảng viên' })
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['TEACHER:VIEW_DETAIL'])
  @ApiOperation({ summary: 'Chi tiết giảng viên' })
  @Post('find-by-id')
  async findById(@Body() data: IdDto) {
    return await this.service.findById(data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['TEACHER:VIEW_LIST'])
  @ApiOperation({ summary: 'Danh sách cho selectbox' })
  @Post('selectbox')
  async selectbox() {
    return await this.service.selectBox();
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['TEACHER:CREATED'])
  @ApiOperation({ summary: 'Tạo giảng viên' })
  @Post('create')
  async create(@Body() data: CreateEmployeeDto, @CurrentUser() user: UserDto) {
    return await this.service.create(user, data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['TEACHER:EDITED'])
  @ApiOperation({ summary: 'Cập nhật giảng viên' })
  @Post('update')
  async update(@Body() data: UpdateEmployeeDto, @CurrentUser() user: UserDto) {
    return await this.service.update(user, data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['TEACHER:DEACTIVATED'])
  @ApiOperation({ summary: 'Ngừng hoạt động giảng viên' })
  @Post('deactivate')
  async deactivate(@Body() data: { id: string }, @CurrentUser() user: UserDto) {
    return await this.service.deactivate(user, data.id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['TEACHER:ACTIVATED'])
  @ApiOperation({ summary: 'Kích hoạt giảng viên' })
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
      throw new NotFoundException('Không tìm thấy profile giảng viên');
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
