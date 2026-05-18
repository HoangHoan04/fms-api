import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateLoginLogDto } from '../dto';
import { LoginLogService } from '../login-log.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Login Log - User')
@Controller('user/login-log')
export class LoginLogUserController {
  constructor(private readonly service: LoginLogService) {}

  @ApiOperation({ summary: 'Tạo lịch sử đăng nhập' })
  @Post('create')
  public async create(@Body() dto: CreateLoginLogDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ summary: 'Lấy chi tiết lịch sử đăng nhập' })
  @Post('find-by-id/:id')
  public async findById(@Body() data: IdDto) {
    return await this.service.findById(data);
  }

  @ApiOperation({ summary: 'Danh sách lịch sử đăng nhập của người dùng' })
  @Post('pagination')
  public async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }
}
