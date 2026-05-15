import { JwtAuthGuard, RoleGuard, PermissionGuard } from '@/common/guards';
import { RequirePermissions, RequireRoles } from '@/common/decorators';
import { PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActionLogService } from './action-log.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
@RequireRoles('ADMIN')
@ApiTags('ActionLog')
@Controller('action-log')
export class ActionLogController {
  constructor(private readonly service: ActionLogService) {}

  @ApiOperation({ summary: 'Hàm phân trang' })
  @RequirePermissions(['ACTION_LOG:VIEW_LIST'])
  @Post('pagination')
  public async pagination(@Body() data: PaginationDto) {
    return this.service.pagination(data);
  }
}
