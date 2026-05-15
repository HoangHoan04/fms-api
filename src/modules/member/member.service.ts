import { enumData } from '@/common/contanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { MemberEntity, UserEntity } from '@/entities/users';
import { transformKeys } from '@/helpers';
import {
  FileArchivalRepository,
  MemberAccessRightRepository,
  MemberAnswerRepository,
  MemberCertStatRepository,
  MemberRepository,
  MemberSkillStatRepository,
  MemberTopicStatRepository,
  UserRepository,
} from '@/repositories';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../action-log/action-log.service';
import { ActionLogCreateDto } from '../action-log/dto';
import { FileArchivalCreateDto } from '../file-archival/dto';
import { FileArchivalService } from '../file-archival/file-archival.service';

@Injectable()
export class MemberService {
  constructor(
    private readonly repo: MemberRepository,
    private readonly userRepo: UserRepository,
    private readonly fileArchivalService: FileArchivalService,
    private readonly actionLogService: ActionLogService,
    private readonly fileArchivalRepo: FileArchivalRepository,
    private readonly accessRightRepo: MemberAccessRightRepository,
    private readonly answerRepo: MemberAnswerRepository,
    private readonly certStatRepo: MemberCertStatRepository,
    private readonly skillStatRepo: MemberSkillStatRepository,
    private readonly topicStatRepo: MemberTopicStatRepository,
  ) {}

  private genCodeMember() {
    const generate = customAlphabet('0123456789', 5);
    return `HV-${generate()}`;
  }

  async findById(data: IdDto) {
    const result = await this.repo.findOne({
      where: { id: data.id },
      relations: {
        avatar: true,
        user: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy thành viên');
    }
    const userEntity = result.user;
    let safeUser: any = null;
    if (userEntity) {
      const tempUser = { ...userEntity };
      delete tempUser.password;
      delete tempUser.refreshToken;
      safeUser = tempUser;
    }

    const avatarList = await result.avatar;

    const avatarArray =
      avatarList && avatarList.length > 0
        ? avatarList.map((avatar) => ({
            fileName: avatar.fileName,
            fileUrl: avatar.fileUrl,
          }))
        : [];

    const finalData = {
      ...result,
      avatar: avatarArray,
      user: safeUser,
    };

    const dataResult = transformKeys(finalData);

    return {
      message: 'Tìm kiếm thành viên thành công',
      data: dataResult,
    };
  }

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

  async create(user: UserDto, createDto: CreateMemberDto) {
    const existingMember = await this.repo.findOne({
      where: [
        { email: createDto.email, isDeleted: false },
        { phone: createDto.phone, isDeleted: false },
      ],
    });
    if (existingMember)
      throw new Error('Email hoặc số điện thoại thành viên đã tồn tại');

    const member = new MemberEntity();
    member.id = uuidv4();
    member.code = this.genCodeMember();
    member.fullName = createDto.fullName;
    member.phone = createDto.phone;
    member.gender = createDto.gender;
    member.email = createDto.email;
    member.birthday = createDto.birthday;
    member.occupation = createDto.occupation;
    member.school = createDto.school;
    member.targetCertId = createDto.targetCertId;
    member.targetScore = createDto.targetScore;
    member.createdBy = user.id;
    member.createdAt = new Date();

    await this.repo.save(member);

    const avatarData = Array.isArray(createDto.avatar)
      ? createDto.avatar[0]
      : createDto.avatar;
    if (avatarData?.fileUrl && avatarData?.fileName) {
      const fileArchival: FileArchivalCreateDto = {
        fileUrl: avatarData.fileUrl,
        fileName: avatarData.fileName,
        fileType: 'STUDENT_AVATAR',
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        fileRelationName: 'memberId',
        fileRelationId: member.id,
      };
      await this.fileArchivalService.create(fileArchival);
    }

    const existingUser = await this.userRepo.findOne({
      where: { username: member.phone },
    });
    if (existingUser) {
      throw new BadRequestException('Người dùng đã tồn tại! ');
    }

    const newUser = new UserEntity();
    newUser.id = uuidv4();
    newUser.username = member.phone || member.email;
    newUser.password = '123456';
    newUser.email = member.email;
    newUser.isActive = true;
    newUser.isAdmin = false;
    newUser.memberId = member.id;
    newUser.employeeId = undefined;
    newUser.createdBy = user.id;
    newUser.createdAt = new Date();
    await this.userRepo.save(newUser);
    await this.repo.update(member.id, { userId: newUser.id });

    const actionLogDto: ActionLogCreateDto = {
      functionId: member.id,
      functionType: 'STUDENT',
      type: enumData.ActionLogType.CREATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      description: `Tạo mới thành viên: ${member.code}`,
      oldData: '{}',
      newData: JSON.stringify(member),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới thành viên thành công',
    };
  }

  async update(user: UserDto, updateDto: UpdateMemberDto) {
    const member = await this.repo.findOne({
      where: { id: updateDto.id },
    });

    if (!member) {
      throw new NotFoundException('Không tìm thấy thành viên');
    }

    if (updateDto.avatar !== undefined) {
      await this.fileArchivalRepo.delete({ memberId: member.id });
      const avatarData = Array.isArray(updateDto.avatar)
        ? updateDto.avatar[0]
        : updateDto.avatar;

      if (avatarData) {
        const fileUrl =
          typeof avatarData === 'string' ? avatarData : avatarData.fileUrl;
        const fileName =
          typeof avatarData === 'string'
            ? `avatar_${member.code}`
            : avatarData.fileName;

        if (fileUrl) {
          const fileArchivalDto: FileArchivalCreateDto = {
            fileUrl,
            fileName: fileName || 'avatar.jpg',
            fileType: 'STUDENT_AVATAR',
            fileRelationName: 'memberId',
            fileRelationId: member.id,
            createdBy: user.id,
            createdAt: new Date().toISOString(),
          };
          await this.fileArchivalService.create(fileArchivalDto);
        }
      }
    }

    const { avatar, id, ...restUpdateData } = updateDto;

    const memberUpdateData: any = {
      ...restUpdateData,
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    await this.repo.update(member.id, memberUpdateData);

    const updatedMember = await this.repo.findOne({
      where: { id: member.id },
      relations: {
        avatar: true,
        user: true,
      },
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: member.id,
      functionType: 'STUDENT',
      type: enumData.ActionLogType.UPDATE.code,
      createdById: user.id,
      createdByCode: user.code,
      createdByName: user.username,
      description: `Cập nhật thông tin thành viên: ${member.code}`,
      oldData: JSON.stringify(member),
      newData: JSON.stringify(updatedMember),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật thành viên thành công',
      data: transformKeys(updatedMember),
    };
  }

  async deactivate(user: UserDto, id: string) {
    const member = await this.repo.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException('Không tìm thấy thành viên');
    }

    await this.repo.update(id, { isDeleted: true });

    const memberUsers = await this.userRepo.find({
      where: { memberId: id },
    });

    if (memberUsers.length) {
      await this.userRepo.update(
        { memberId: id },
        {
          isDeleted: true,
          isActive: false,
          updatedBy: user.id,
          updatedAt: new Date(),
        },
      );
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: member.id,
      functionType: 'STUDENT',
      type: enumData.ActionLogType.DEACTIVATE.code,
      createdById: user.id,
      createdByCode: user.code,
      createdByName: user.username,
      description: `Ngừng hoạt động thành viên với code: ${member.code}`,
      oldData: JSON.stringify(member),
      newData: JSON.stringify({
        ...member,
        isDeleted: true,
        users: memberUsers.map((u) => ({
          id: u.id,
          isDeleted: true,
          isActive: false,
        })),
      }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Ngừng hoạt động thành viên thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const member = await this.repo.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException('Không tìm thấy thành viên');
    }

    const memberUsers = await this.userRepo.find({
      where: { memberId: id },
    });

    await this.repo.update(id, { isDeleted: false });
    if (memberUsers.length) {
      await this.userRepo.update(
        { memberId: id },
        {
          isDeleted: false,
          isActive: true,
        },
      );
    }
    const actionLogDto: ActionLogCreateDto = {
      functionId: member.id,
      functionType: 'STUDENT',
      type: enumData.ActionLogType.ACTIVATE.code,
      createdById: user.id,
      createdByCode: user.code,
      createdByName: user.username,
      description: `Kích hoạt thành viên với code: ${member.code}`,
      oldData: JSON.stringify(member),
      newData: JSON.stringify({
        ...member,
        isDeleted: false,
        users: memberUsers.map((u) => ({
          id: u.id,
          isDeleted: false,
          isActive: true,
        })),
      }),
    };

    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Kích hoạt thành viên thành công',
    };
  }

  async findByCodes(codes: string[]): Promise<MemberEntity[]> {
    return await this.repo.find({
      where: {
        code: In(codes),
        isDeleted: false,
      },
    });
  }

  async findByIds(ids: string[]): Promise<MemberEntity[]> {
    return await this.repo.find({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });
  }

  async findByPhones(phones: string[]): Promise<MemberEntity[]> {
    return await this.repo.find({
      where: {
        phone: In(phones),
        isDeleted: false,
      },
    });
  }

  async findByPhoneEmail(phone: string, email: string, user: UserDto) {
    const res = await this.repo.find({
      where: [
        { phone: phone, isDeleted: false },
        { email: email, isDeleted: false },
      ],
    });

    const filtered = res.filter((s) => s.id !== user.memberId);
    return filtered;
  }

  async updateAvatar(user: UserDto, data: UpdateMemberAvatarDto) {
    const checkMember = await this.repo.findOne({
      where: { id: user.memberId },
    });
    if (!checkMember) throw new NotFoundException('Không tìm thấy thành viên');

    await this.fileArchivalRepo.delete({ memberId: checkMember.id });

    const fileArchival = new FileArchivalCreateDto();
    fileArchival.createdBy = user.id;
    fileArchival.fileUrl = data.avatarUrl;
    fileArchival.fileName = 'avatarUrl';
    fileArchival.fileType = 'STUDENT_AVATAR';
    fileArchival.fileRelationName = 'memberId';
    fileArchival.fileRelationId = checkMember.id;
    fileArchival.createdAt = new Date().toISOString();
    await this.fileArchivalService.create(fileArchival);

    return {
      message: 'Cập nhật ảnh đại diện thành công',
    };
  }

  async findAccessRightsByMember(memberId: string) {
    const data = await this.accessRightRepo.find({ where: { memberId } });
    return { data };
  }

  async checkAccessRight(memberId: string, itemType: string, itemId?: string) {
    const where: any = { memberId, itemType };
    if (itemId) where.itemId = itemId;

    const rights = await this.accessRightRepo.find({ where });
    const now = new Date();
    const hasAccess = rights.some(
      (r) =>
        (!r.validFrom || r.validFrom <= now) &&
        (!r.validUntil || r.validUntil >= now),
    );
    return { hasAccess, data: rights };
  }

  async findAnswersBySession(sessionId: string) {
    const items = await this.answerRepo.find({
      where: { sessionId, isDeleted: false },
      relations: { question: true, examQuestion: true },
      order: { createdAt: 'ASC' },
    });
    return { data: items };
  }

  async findAnswerById(data: IdDto) {
    const result = await this.answerRepo.findOne({
      where: { id: data.id },
      relations: { session: true, question: true, examQuestion: true },
    });
    if (!result) {
      throw new NotFoundException('Không tìm thấy câu trả lời');
    }
    return { message: 'Tìm kiếm câu trả lời thành công', data: result };
  }

  async upsertCertStat(dto: CreateMemberCertStatDto) {
    const existing = await this.certStatRepo.findOne({
      where: { memberId: dto.memberId, certTypeId: dto.certTypeId },
    });

    if (existing) {
      if (dto.elo !== undefined) existing.elo = dto.elo;
      if (dto.totalExams !== undefined) existing.totalExams = dto.totalExams;
      if (dto.totalPractices !== undefined)
        existing.totalPractices = dto.totalPractices;
      if (dto.totalArenaMatches !== undefined)
        existing.totalArenaMatches = dto.totalArenaMatches;
      if (dto.arenaWins !== undefined) existing.arenaWins = dto.arenaWins;
      if (dto.avgExamScore !== undefined)
        existing.avgExamScore = dto.avgExamScore;
      if (dto.bestExamScore !== undefined)
        existing.bestExamScore = dto.bestExamScore;
      if (dto.estimatedScore !== undefined)
        existing.estimatedScore = dto.estimatedScore;
      if (dto.streakDays !== undefined) existing.streakDays = dto.streakDays;
      if (dto.totalStudyMins !== undefined)
        existing.totalStudyMins = dto.totalStudyMins;
      if (dto.lastActivityAt !== undefined)
        existing.lastActivityAt = dto.lastActivityAt;
      await this.certStatRepo.save(existing);
    } else {
      const entity = new MemberCertStatEntity();
      entity.memberId = dto.memberId;
      entity.certTypeId = dto.certTypeId;
      entity.elo = dto.elo ?? 1000;
      entity.totalExams = dto.totalExams ?? 0;
      entity.totalPractices = dto.totalPractices ?? 0;
      entity.totalArenaMatches = dto.totalArenaMatches ?? 0;
      entity.arenaWins = dto.arenaWins ?? 0;
      entity.avgExamScore = dto.avgExamScore ?? 0;
      entity.bestExamScore = dto.bestExamScore ?? 0;
      entity.estimatedScore = (dto.estimatedScore ?? null) as string;
      entity.streakDays = dto.streakDays ?? 0;
      entity.totalStudyMins = dto.totalStudyMins ?? 0;
      entity.lastActivityAt = dto.lastActivityAt as Date;
      await this.certStatRepo.save(entity);
    }

    return { message: 'Cập nhật thống kê chứng chỉ thành công' };
  }

  async getCertStatById(id: string) {
    const result = await this.certStatRepo.findOne({ where: { id } });
    if (!result) throw new NotFoundException('Không tìm thấy thống kê');
    return { data: result };
  }

  async findCertStatsByMember(memberId: string) {
    const data = await this.certStatRepo.find({ where: { memberId } });
    return { data };
  }

  async findSkillStatsByMember(memberId: string) {
    const data = await this.skillStatRepo.find({ where: { memberId } });
    return { data };
  }

  async findSkillStatsBySkill(certSkillId: string) {
    const data = await this.skillStatRepo.find({ where: { certSkillId } });
    return { data };
  }

  async findTopicStatsByMember(memberId: string) {
    const data = await this.topicStatRepo.find({ where: { memberId } });
    return { data };
  }

  async findTopicStatsByTopic(topicId: string) {
    const data = await this.topicStatRepo.find({ where: { topicId } });
    return { data };
  }
}
