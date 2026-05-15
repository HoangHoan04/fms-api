import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmployeeService } from '../employee.service';

@ApiTags('Employee')
@Controller('employee')
export class UserEmployeeController {
  constructor(private readonly service: EmployeeService) {}
}
