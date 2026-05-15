import {
  CurrentUser,
  RequirePermissions,
  RequireRoles,
} from '@/common/decorators';
import { JwtAuthGuard, PermissionGuard, RoleGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApproveReceiptDto, CreateReceiptDto, RejectReceiptDto } from './dto';
import { ReceiptService } from './receipt.service';

@ApiTags('Receipt')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
@RequireRoles('ADMIN')
@Controller('receipt')
export class ReceiptController {
  constructor(private readonly service: ReceiptService) {}

  @ApiOperation({ summary: 'Phân trang đơn đăng ký nhận tiền' })
  @RequirePermissions(['RECEIPT:VIEW_LIST'])
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Chi tiết đơn đăng ký' })
  @RequirePermissions(['RECEIPT:VIEW_DETAIL'])
  @Post('find-by-id')
  async findById(@Body() data: IdDto) {
    return await this.service.findById(data);
  }

  @ApiOperation({ summary: 'Tạo đơn đăng ký nhận tiền' })
  @RequirePermissions(['RECEIPT:CREATED'])
  @Post('create')
  async create(@Body() data: CreateReceiptDto, @CurrentUser() user: UserDto) {
    return await this.service.create(user, data);
  }

  @ApiOperation({ summary: 'Duyệt đơn đăng ký' })
  @RequirePermissions(['RECEIPT:APPROVED'])
  @Post('approve')
  async approve(@Body() data: ApproveReceiptDto, @CurrentUser() user: UserDto) {
    return await this.service.approve(user, data);
  }

  @ApiOperation({ summary: 'Từ chối đơn đăng ký' })
  @RequirePermissions(['RECEIPT:REJECTED'])
  @Post('reject')
  async reject(@Body() data: RejectReceiptDto, @CurrentUser() user: UserDto) {
    return await this.service.reject(user, data);
  }

  @ApiOperation({ summary: 'Lịch sử phê duyệt' })
  @RequirePermissions(['RECEIPT:VIEW_LIST'])
  @Post('approvals')
  async getApprovals(@Body() data: { receiptId: string }) {
    return await this.service.getApprovals(data.receiptId);
  }
}
