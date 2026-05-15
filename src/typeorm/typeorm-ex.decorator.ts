import { TYPEORM_EX_CUSTOM_REPOSITORY } from '@/common/contanst';
import { SetMetadata } from '@nestjs/common';

export function CustomRepository(entity: Function): ClassDecorator {
  return SetMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, entity);
}
