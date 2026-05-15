import { PaginationDto } from '@/dto';
import { FundTransactionEntity } from '@/entities';
import { FundTransactionRepository } from '@/repositories';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(private readonly repo: FundTransactionRepository) {}

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<FundTransactionEntity> = {};
    if (data.where?.fundId) whereCon.fundId = data.where.fundId;
    if (data.where?.cycleId) whereCon.cycleId = data.where.cycleId;
    if (data.where?.transactionType)
      whereCon.transactionType = data.where.transactionType;
    if (data.where?.direction) whereCon.direction = data.where.direction;

    const [items, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { transactionDate: 'DESC' },
      relations: { fund: true, cycle: true, performer: true },
    });
    return { data: items, total };
  }

  async getBalance(fundId: string) {
    const result = await this.repo
      .createQueryBuilder('t')
      .select(
        'SUM(CASE WHEN t.direction = :in THEN t.amount ELSE -t.amount END)',
        'balance',
      )
      .where('t.fundId = :fundId', { fundId })
      .andWhere('t.isDeleted = false')
      .setParameter('in', 'in')
      .getRawOne();
    return { data: { fundId, balance: Number(result?.balance || 0) } };
  }
}
