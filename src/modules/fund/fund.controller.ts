import {
  CurrentUser,
  RequirePermissions,
  RequireRoles,
} from '@/common/decorators';
import { JwtAuthGuard, PermissionGuard, RoleGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFundDto, UpdateFundDto } from './dto/fund.dto';
import { FundService } from './fund.service';

@ApiTags('Fund')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
@RequireRoles('ADMIN')
@Controller('fund')
export class FundController {
  constructor(private readonly service: FundService) {}

  @ApiOperation({ summary: 'Phân trang quỹ' })
  @RequirePermissions(['FUND:VIEW_LIST'])
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Chi tiết quỹ' })
  @RequirePermissions(['FUND:VIEW_DETAIL'])
  @Post('find-by-id')
  async findById(@Body() data: IdDto) {
    return await this.service.findById(data);
  }

  @ApiOperation({ summary: 'Danh sách quỹ cho selectbox' })
  @RequirePermissions(['FUND:VIEW_LIST'])
  @Post('selectbox')
  async selectbox() {
    return await this.service.selectbox();
  }

  @ApiOperation({ summary: 'Tạo mới quỹ' })
  @RequirePermissions(['FUND:CREATED'])
  @Post('create')
  async create(@Body() data: CreateFundDto, @CurrentUser() user: UserDto) {
    return await this.service.create(user, data);
  }

  @ApiOperation({ summary: 'Cập nhật quỹ' })
  @RequirePermissions(['FUND:EDITED'])
  @Post('update')
  async update(@Body() data: UpdateFundDto, @CurrentUser() user: UserDto) {
    return await this.service.update(user, data);
  }

  @ApiOperation({ summary: 'Ngừng hoạt động quỹ' })
  @RequirePermissions(['FUND:DEACTIVATED'])
  @Post('deactivate')
  async deactivate(@Body() data: { id: string }, @CurrentUser() user: UserDto) {
    return await this.service.deactivate(user, data.id);
  }

  @ApiOperation({ summary: 'Kích hoạt quỹ' })
  @RequirePermissions(['FUND:ACTIVATED'])
  @Post('activate')
  async activate(@Body() data: { id: string }, @CurrentUser() user: UserDto) {
    return await this.service.activate(user, data.id);
  }

  @ApiOperation({ summary: 'Thêm thành viên vào quỹ' })
  @RequirePermissions(['FUND:EDITED'])
  @Post('add-member')
  async addMember(@Body() data: FundMemberDto, @CurrentUser() user: UserDto) {
    return await this.service.addMember(user, data);
  }

  @ApiOperation({ summary: 'Xóa thành viên khỏi quỹ' })
  @RequirePermissions(['FUND:EDITED'])
  @Post('remove-member')
  async removeMember(
    @Body() data: { id: string },
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.removeMember(user, data.id);
  }

  @ApiOperation({ summary: 'Danh sách thành viên trong quỹ' })
  @RequirePermissions(['FUND:VIEW_LIST'])
  @Post('list-members')
  async listMembers(@Body() data: { fundId: string }) {
    return await this.service.listMembers(data.fundId);
  }
}
