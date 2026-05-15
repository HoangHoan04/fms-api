import { CurrentUser, RequirePermissions, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard, PermissionGuard, RoleGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FundCycleService } from './fund-cycle.service';
import { CreateFundCycleDto, UpdateFundCycleDto } from './dto';

@ApiTags('FundCycle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
@RequireRoles('ADMIN')
@Controller('fund-cycle')
export class FundCycleController {
  constructor(private readonly service: FundCycleService) {}

  @ApiOperation({ summary: 'Phân trang chu kỳ quỹ' })
  @RequirePermissions(['FUND:VIEW_LIST'])
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Chi tiết chu kỳ' })
  @RequirePermissions(['FUND:VIEW_DETAIL'])
  @Post('find-by-id')
  async findById(@Body() data: IdDto) {
    return await this.service.findById(data);
  }

  @ApiOperation({ summary: 'Danh sách chu kỳ cho selectbox' })
  @RequirePermissions(['FUND:VIEW_LIST'])
  @Post('selectbox')
  async selectbox() {
    return await this.service.selectbox();
  }

  @ApiOperation({ summary: 'Tạo chu kỳ mới (kèm danh sách đóng tiền cho thành viên)' })
  @RequirePermissions(['FUND:CREATED'])
  @Post('create')
  async create(@Body() data: CreateFundCycleDto, @CurrentUser() user: UserDto) {
    return await this.service.create(user, data);
  }

  @ApiOperation({ summary: 'Cập nhật chu kỳ' })
  @RequirePermissions(['FUND:EDITED'])
  @Post('update')
  async update(@Body() data: UpdateFundCycleDto, @CurrentUser() user: UserDto) {
    return await this.service.update(user, data);
  }

  @ApiOperation({ summary: 'Đóng chu kỳ' })
  @RequirePermissions(['FUND:EDITED'])
  @Post('close')
  async close(@Body() data: { id: string }, @CurrentUser() user: UserDto) {
    return await this.service.close(user, data.id);
  }

  @ApiOperation({ summary: 'Xóa chu kỳ' })
  @RequirePermissions(['FUND:DELETED'])
  @Post('delete')
  async delete(@Body() data: { id: string }, @CurrentUser() user: UserDto) {
    return await this.service.delete(user, data.id);
  }
}
