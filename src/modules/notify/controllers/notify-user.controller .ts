import { JwtAuthGuard } from '@/common/guards';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotifyService } from '../notify.service';

@ApiTags('Notify')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notify')
export class NotifyController {
  constructor(private readonly service: NotifyService) {}
}
