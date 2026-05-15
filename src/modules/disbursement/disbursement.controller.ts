import {
  CurrentUser,
  RequirePermissions,
  RequireRoles,
} from '@/common/decorators';
import { JwtAuthGuard, PermissionGuard, RoleGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfirmDisbursementDto, CreateDisbursementDto } from './dto';
import { DisbursementService } from './disbursement.service';

@ApiTags('Disbursement')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
@RequireRoles('ADMIN')
@Controller('disbursement')
export class DisbursementController {
  constructor(private readonly service: DisbursementService) {}

  @ApiOperation({ summary: 'Phân trang phiếu giải ngân' })
  @RequirePermissions(['DISBURSEMENT:VIEW_LIST'])
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Chi tiết phiếu giải ngân' })
  @RequirePermissions(['DISBURSEMENT:VIEW_DETAIL'])
  @Post('find-by-id')
  async findById(@Body() data: IdDto) {
    return await this.service.findById(data);
  }

  @ApiOperation({ summary: 'Tạo phiếu giải ngân' })
  @RequirePermissions(['DISBURSEMENT:CREATED'])
  @Post('create')
  async create(
    @Body() data: CreateDisbursementDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.create(user, data);
  }

  @ApiOperation({ summary: 'Xác nhận đã nhận tiền' })
  @RequirePermissions(['DISBURSEMENT:EDITED'])
  @Post('confirm')
  async confirm(
    @Body() data: ConfirmDisbursementDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.confirm(user, data);
  }

  @ApiOperation({ summary: 'Danh sách xác nhận' })
  @RequirePermissions(['DISBURSEMENT:VIEW_LIST'])
  @Post('confirmations')
  async getConfirmations(@Body() data: { disbursementId: string }) {
    return await this.service.getConfirmations(data.disbursementId);
  }
}
