import { IdDto, PaginationDto, UserDto } from '@/dto';
import { MemberEntity } from '@/entities';
import { MemberRepository, UserRepository } from '@/repositories';
import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { FindOptionsWhere, ILike } from 'typeorm';
import { ActionLogService } from '../action-log/action-log.service';
import { FileArchivalService } from '../file-archival/file-archival.service';
import { CreateMemberDto, UpdateMemberDto } from './dto';

@Injectable()
export class MemberService {
  constructor(
    private readonly repo: MemberRepository,
    private readonly userRepo: UserRepository,
    private readonly fileArchivalService: FileArchivalService,
    private readonly actionLogService: ActionLogService,
  ) {}

  private genCodeMember() {
    const generate = customAlphabet('0123456789', 5);
    return `A3-${generate()}`;
  }

  async findById(data: IdDto) {}

  async selectBox() {
    const res: any[] = await this.repo.find({
      where: { isDeleted: false },
      select: {
        id: true,
        code: true,
        fullName: true,
      },
    });
    return res;
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<MemberEntity> = {};

    if (data.where.code) whereCon.code = ILike(`%${data.where.code}%`);
    if (data.where.fullName)
      whereCon.fullName = ILike(`%${data.where.fullName}%`);
    if (data.where.nickname)
      whereCon.nickname = ILike(`%${data.where.nickname}%`);
    if (data.where.phone) whereCon.phone = ILike(`%${data.where.phone}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [members, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: members,
      total,
    };
  }

  async create(user: UserDto, createDto: CreateMemberDto) {}

  async update(user: UserDto, updateDto: UpdateMemberDto) {}

  async deactivate(user: UserDto, id: IdDto) {}

  async activate(user: UserDto, id: IdDto) {}

  async findByCodes(codes: string[]) {}

  async findByIds(ids: string[]) {}

  async findByPhones(phones: string[]) {}

  async findByPhoneEmail(phone: string, email: string, user: UserDto) {}
}
