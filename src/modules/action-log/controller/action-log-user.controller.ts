import { RequireRoles } from '@/common/decorators';
import { JwtAuthGuard, PermissionGuard, RoleGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActionLogService } from '../action-log.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
@RequireRoles('USER')
@ApiTags('ActionLog - User')
@Controller('action-log')
export class UserActionLogController {
  constructor(private readonly service: ActionLogService) {}
  @ApiOperation({ summary: 'Lấy chi tiết action log' })
  @Post('find-by-id')
  public async findById(@Body() data: IdDto) {
    return await this.service.findById(data);
  }

  @ApiOperation({ summary: 'Phân trang action log của người dùng' })
  @Post('pagination')
  public async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }
}
