import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterTransactionDto {
  @ApiPropertyOptional({ description: 'ID quỹ' })
  @IsOptional()
  @IsUUID()
  fundId?: string;

  @ApiPropertyOptional({ description: 'ID chu kỳ' })
  @IsOptional()
  @IsUUID()
  cycleId?: string;

  @ApiPropertyOptional({ description: 'Loại giao dịch' })
  @IsOptional()
  @IsString()
  transactionType?: string;

  @ApiPropertyOptional({ description: 'Chiều: in | out' })
  @IsOptional()
  @IsString()
  direction?: string;
}
