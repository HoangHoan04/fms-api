import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateFileArchivalDto,
  CreateManyFileArchivalDto,
  UpdateFileArchivalDto,
} from './dto';
import { FileArchivalService } from './file-archival.service';

@ApiTags('File Archival')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('file-archival')
export class FileArchivalController {
  constructor(private readonly service: FileArchivalService) {}

  @ApiOperation({ summary: 'Tạo mới file' })
  @Post('create')
  async create(@Body() data: CreateFileArchivalDto) {
    return await this.service.create(data);
  }

  @ApiOperation({ summary: 'Tạo nhiều file' })
  @Post('create-many')
  async createMany(@Body() data: CreateManyFileArchivalDto) {
    return await this.service.createMany(data);
  }

  @ApiOperation({ summary: 'Chi tiết file' })
  @Post('find-by-id')
  async findById(@Body() data: IdDto) {
    return await this.service.findById(data.id);
  }

  @ApiOperation({ summary: 'Phân trang file' })
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Cập nhật file' })
  @Post('update')
  async update(@Body() data: UpdateFileArchivalDto) {
    return await this.service.update(data);
  }

  @ApiOperation({ summary: 'Xóa file' })
  @Post('remove')
  async remove(@Body() data: IdDto) {
    await this.service.remove(data.id);
    return { message: 'Xóa file thành công' };
  }
}
