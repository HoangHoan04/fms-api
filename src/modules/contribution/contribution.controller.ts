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
  ConfirmContributionDto,
  CreateContributionDto,
  UpdateContributionDto,
} from './dto';
import { ContributionService } from './contribution.service';

@ApiTags('Contribution')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
@RequireRoles('ADMIN')
@Controller('contribution')
export class ContributionController {
  constructor(private readonly service: ContributionService) {}

  @ApiOperation({ summary: 'Phân trang khoản đóng' })
  @RequirePermissions(['CONTRIBUTION:VIEW_LIST'])
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Chi tiết khoản đóng' })
  @RequirePermissions(['CONTRIBUTION:VIEW_DETAIL'])
  @Post('find-by-id')
  async findById(@Body() data: IdDto) {
    return await this.service.findById(data);
  }

  @ApiOperation({ summary: 'Danh sách khoản đóng cho selectbox' })
  @RequirePermissions(['CONTRIBUTION:VIEW_LIST'])
  @Post('selectbox')
  async selectbox() {
    return await this.service.selectbox();
  }

  @ApiOperation({ summary: 'Tạo khoản đóng' })
  @RequirePermissions(['CONTRIBUTION:CREATED'])
  @Post('create')
  async create(
    @Body() data: CreateContributionDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.create(user, data);
  }

  @ApiOperation({ summary: 'Cập nhật khoản đóng' })
  @RequirePermissions(['CONTRIBUTION:EDITED'])
  @Post('update')
  async update(
    @Body() data: UpdateContributionDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.update(user, data);
  }

  @ApiOperation({ summary: 'Xác nhận đã nhận tiền' })
  @RequirePermissions(['CONTRIBUTION:EDITED'])
  @Post('confirm')
  async confirm(
    @Body() data: ConfirmContributionDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.confirm(user, data);
  }

  @ApiOperation({ summary: 'Xóa khoản đóng' })
  @RequirePermissions(['CONTRIBUTION:DELETED'])
  @Post('delete')
  async delete(@Body() data: { id: string }, @CurrentUser() user: UserDto) {
    return await this.service.delete(user, data.id);
  }

  @ApiOperation({ summary: 'Lịch sử nhắc nhở' })
  @RequirePermissions(['CONTRIBUTION:VIEW_LIST'])
  @Post('reminders')
  async getReminders(@Body() data: { contributionId: string }) {
    return await this.service.getReminders(data.contributionId);
  }
}
