import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterOneDto {
  @ApiProperty({
    description: 'Id của đối tượng',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsUUID()
  @IsOptional()
  id?: string;
}

export class IdDto {
  @ApiProperty({
    description: 'Id của đối tượng',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsUUID()
  @IsNotEmpty()
  @Expose()
  id: string;
}

export class CodeDto {
  @ApiProperty({
    description: 'Code của đối tượng',
    example: 'CODE123',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
