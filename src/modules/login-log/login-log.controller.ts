import { RequirePermissions, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard, PermissionGuard, RoleGuard } from '@/common/guards';
import { PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginLogService } from './login-log.service';

@ApiTags('LoginLog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
@RequireRoles('ADMIN')
@Controller('login-log')
export class LoginLogController {
  constructor(private readonly service: LoginLogService) {}

  @ApiOperation({ summary: 'Lịch sử đăng nhập phân trang' })
  @RequirePermissions(['LOGIN_LOG:VIEW_LIST'])
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }
}
