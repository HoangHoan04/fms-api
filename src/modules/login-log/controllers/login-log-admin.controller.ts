import { RequirePermissions, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard, PermissionGuard, RoleGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateLoginLogDto,
  CreateManyLoginLogDto,
  UpdateLoginLogDto,
} from '../dto';
import { LoginLogService } from '../login-log.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
@RequireRoles('ADMIN')
@ApiTags('Login Log - Admin')
@Controller('login-log')
export class LoginLogAdminController {
  constructor(private readonly service: LoginLogService) {}

  @ApiOperation({ summary: 'Tạo lịch sử đăng nhập' })
  @RequirePermissions(['LOGIN_LOG:CREATE'])
  @Post('create')
  public async create(@Body() dto: CreateLoginLogDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ summary: 'Tạo nhiều lịch sử đăng nhập' })
  @RequirePermissions(['LOGIN_LOG:CREATE'])
  @Post('create-many')
  public async createMany(@Body() dto: CreateManyLoginLogDto) {
    return await this.service.createMany(dto);
  }

  @ApiOperation({ summary: 'Lấy chi tiết lịch sử đăng nhập' })
  @RequirePermissions(['LOGIN_LOG:VIEW_DETAIL'])
  @Post('find-by-id')
  public async findById(@Body() data: IdDto) {
    return await this.service.findById(data);
  }

  @ApiOperation({ summary: 'Danh sách lịch sử đăng nhập' })
  @RequirePermissions(['LOGIN_LOG:VIEW_LIST'])
  @Post('pagination')
  public async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Cập nhật lịch sử đăng nhập' })
  @RequirePermissions(['LOGIN_LOG:UPDATE'])
  @Post('update/:id')
  public async update(@Body() data: IdDto, @Body() dto: UpdateLoginLogDto) {
    return await this.service.update(data, dto);
  }

  @ApiOperation({ summary: 'Xóa lịch sử đăng nhập' })
  @RequirePermissions(['LOGIN_LOG:DELETE'])
  @Post('remove/:id')
  public async remove(@Body() data: IdDto) {
    await this.service.remove(data);
    return { message: 'Xóa thành công' };
  }
}
