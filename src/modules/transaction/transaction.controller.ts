import { RequirePermissions, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard, PermissionGuard, RoleGuard } from '@/common/guards';
import { PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';

@ApiTags('Transaction')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard, PermissionGuard)
@RequireRoles('ADMIN')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @ApiOperation({ summary: 'Sổ thu chi - phân trang' })
  @RequirePermissions(['TRANSACTION:VIEW_LIST'])
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Xem số dư quỹ' })
  @RequirePermissions(['TRANSACTION:VIEW_LIST'])
  @Post('balance')
  async getBalance(@Body() data: { fundId: string }) {
    return await this.service.getBalance(data.fundId);
  }
}
