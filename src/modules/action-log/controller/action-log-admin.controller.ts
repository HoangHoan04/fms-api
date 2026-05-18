import { RequirePermissions, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard, PermissionGuard, RoleGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActionLogService } from '../action-log.service';
import { ActionLogCreateDto } from '../dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
@RequireRoles('ADMIN')
@ApiTags('ActionLog - Admin')
@Controller('action-log')
export class AdminActionLogController {
  constructor(private readonly service: ActionLogService) {}

  @ApiOperation({ summary: 'Tạo action log' })
  @RequirePermissions(['ACTION_LOG:CREATE'])
  @Post('create')
  public async create(@Body() dto: ActionLogCreateDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ summary: 'Tạo nhiều action log' })
  @RequirePermissions(['ACTION_LOG:CREATE'])
  @Post('create-list')
  public async createList(@Body() dtos: ActionLogCreateDto[]) {
    return await this.service.createList(dtos);
  }

  @ApiOperation({ summary: 'Lấy chi tiết action log' })
  @RequirePermissions(['ACTION_LOG:VIEW_DETAIL'])
  @Post('find-by-id')
  public async findById(@Body() data: IdDto) {
    return await this.service.findById(data);
  }

  @ApiOperation({ summary: 'Phân trang action log' })
  @RequirePermissions(['ACTION_LOG:VIEW_LIST'])
  @Post('pagination')
  public async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }
}
