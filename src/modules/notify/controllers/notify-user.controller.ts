import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotifyService } from '../notify.service';
import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { UserDto, PaginationDto } from '@/dto';

@ApiTags('User - Notify')
@Controller('notify')
export class UserNotifyController {
  constructor(private readonly service: NotifyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('update-seen-all')
  @ApiOperation({ summary: 'Đánh dấu tất cả là đã đọc ( web user)' })
  async updateSeenAllWebUser(@CurrentUser() user: UserDto) {
    return await this.service.updateSeenAll(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-seen-list')
  @ApiOperation({ summary: 'Đánh dấu danh sách thông báo là đã đọc' })
  async updateSeenListNotify(
    @CurrentUser() user: UserDto,
    @Body() body: { lstId: string[] },
  ) {
    return await this.service.updateSeenListNotify(user, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('find-count-notify-not-seen')
  @ApiOperation({ summary: 'Tìm số thông báo chưa đọc' })
  async findCountNotiNotSeen(@CurrentUser() user: UserDto) {
    return await this.service.findCountNotiNotSeen(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách với bộ lọc' })
  async pagination(@Body() body: PaginationDto<any>) {
    return await this.service.pagination(body);
  }
}
