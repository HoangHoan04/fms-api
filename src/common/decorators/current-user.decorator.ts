import { UserDto } from '@/dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const resultPermission: any = {};

    return plainToClass(UserDto, {
      ...request.user,
      ...resultPermission,
    });
  },
);
