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
import { CreateMemberDto, UpdateMemberAvatarDto, UpdateMemberDto } from './dto';
import { MemberService } from './member.service';

@ApiTags('Member')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('member')
export class MemberController {
  constructor(private readonly service: MemberService) {}

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['MEMBER:VIEW_LIST'])
  @ApiOperation({ summary: 'Phân trang thành viên' })
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['MEMBER:VIEW_DETAIL'])
  @ApiOperation({ summary: 'Chi tiết thành viên' })
  @Post('find-by-id')
  async findById(@Body() data: IdDto) {
    return await this.service.findById(data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['MEMBER:VIEW_LIST'])
  @ApiOperation({ summary: 'Danh sách cho selectbox' })
  @Post('selectbox')
  async selectbox() {
    return await this.service.selectBox();
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['MEMBER:CREATED'])
  @ApiOperation({ summary: 'Tạo thành viên' })
  @Post('create')
  async create(@Body() data: CreateMemberDto, @CurrentUser() user: UserDto) {
    return await this.service.create(user, data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['MEMBER:EDITED'])
  @ApiOperation({ summary: 'Cập nhật thành viên' })
  @Post('update')
  async update(@Body() data: UpdateMemberDto, @CurrentUser() user: UserDto) {
    return await this.service.update(user, data);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['MEMBER:DEACTIVATED'])
  @ApiOperation({ summary: 'Ngừng hoạt động thành viên' })
  @Post('deactivate')
  async deactivate(@Body() data: { id: string }, @CurrentUser() user: UserDto) {
    return await this.service.deactivate(user, data.id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
  @RequireRoles('ADMIN')
  @RequirePermissions(['MEMBER:ACTIVATED'])
  @ApiOperation({ summary: 'Kích hoạt thành viên' })
  @Post('activate')
  async activate(@Body() data: { id: string }, @CurrentUser() user: UserDto) {
    return await this.service.activate(user, data.id);
  }

  @ApiOperation({ summary: 'Cập nhật Profile cá nhân' })
  @Post('update-profile')
  async updateProfile(
    @Body() data: UpdateMemberDto,
    @CurrentUser() user: UserDto,
  ) {
    if (!user.memberId)
      throw new NotFoundException('Không tìm thấy profile thành viên');
    return await this.service.update(user, { ...data, id: user.memberId });
  }

  @ApiOperation({ summary: 'Cập nhật ảnh đại diện' })
  @Post('update-avatar')
  async updateAvatar(
    @Body() data: UpdateMemberAvatarDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.updateAvatar(user, data);
  }
}
