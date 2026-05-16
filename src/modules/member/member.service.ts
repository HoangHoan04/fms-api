import { enumData } from '@/common/contanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { MemberBankAccountEntity, MemberEntity, UserEntity } from '@/entities';
import { transformKeys } from '@/helpers';
import {
  MemberBankAccountRepository,
  MemberRepository,
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
import { FileArchivalService } from '../file-archival/file-archival.service';
import { CreateMemberDto, UpdateMemberDto } from './dto';

@Injectable()
export class MemberService {
  constructor(
    private readonly repo: MemberRepository,
    private readonly userRepo: UserRepository,
    private readonly bankAccountRepo: MemberBankAccountRepository,
    private readonly fileArchivalService: FileArchivalService,
    private readonly actionLogService: ActionLogService,
  ) {}

  private genCodeMember() {
    const generate = customAlphabet('0123456789', 5);
    return `A3-${generate()}`;
  }

  async findById(data: IdDto) {
    const result = await this.repo.findOne({
      where: { id: data.id },
      relations: {
        avatar: true,
        user: true,
        bankAccounts: { qrCode: true },
      },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy thành viên');
    }
    const userEntity = result.user;
    let safeUser: any = null;
    if (userEntity) {
      const { password, refreshToken, ...safeFields } = userEntity;
      safeUser = safeFields;
    }

    const avatarList = await result.avatar;

    const avatarArray =
      avatarList && avatarList.length > 0
        ? avatarList.map((avatar) => ({
            fileName: avatar.fileName,
            fileUrl: avatar.fileUrl,
          }))
        : [];

    const bankAccounts = await Promise.all(
      (result.bankAccounts || []).map(async (acc) => {
        const qrCodeFiles = await acc.qrCode;
        const firstQr = qrCodeFiles?.[0];
        return {
          id: acc.id,
          bankName: acc.bankName,
          bankAccountNo: acc.bankAccountNo,
          bankAccountName: acc.bankAccountName,
          qrCode: firstQr
            ? { fileName: firstQr.fileName, fileUrl: firstQr.fileUrl }
            : null,
        };
      }),
    );

    const finalData = {
      ...result,
      avatar: avatarArray,
      bankAccounts,
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
    if (data.where.shortName)
      whereCon.shortName = ILike(`%${data.where.shortName}%`);
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
    member.shortName = createDto.shortName;
    member.phone = createDto.phone;
    member.gender = createDto.gender;
    member.email = createDto.email;
    member.birthday = createDto.birthday;
    member.description = createDto.description;
    member.createdBy = user.id;
    member.createdAt = new Date();

    await this.repo.save(member);

    const avatarData = Array.isArray(createDto.avatar)
      ? createDto.avatar[0]
      : createDto.avatar;
    if (avatarData?.fileUrl && avatarData?.fileName) {
      await this.fileArchivalService.create({
        fileUrl: avatarData.fileUrl,
        fileName: avatarData.fileName,
        fileType: 'MEMBER_AVATAR',
        memberId: member.id,
        createdBy: user.id,
      });
    }

    if (createDto.bankAccounts?.length) {
      for (const bankAcc of createDto.bankAccounts) {
        const bankAccount = new MemberBankAccountEntity();
        bankAccount.id = uuidv4();
        bankAccount.memberId = member.id;
        bankAccount.bankName = bankAcc.bankName;
        bankAccount.bankAccountNo = bankAcc.bankAccountNo;
        bankAccount.bankAccountName = bankAcc.bankAccountName;
        bankAccount.createdBy = user.id;
        bankAccount.createdAt = new Date();
        await this.bankAccountRepo.save(bankAccount);

        if (bankAcc.qrCode?.fileUrl) {
          await this.fileArchivalService.create({
            fileUrl: bankAcc.qrCode.fileUrl,
            fileName:
              bankAcc.qrCode.fileName ||
              `qr_${member.code}_${bankAcc.bankName || 'bank'}`,
            fileType: 'MEMBER_QR_CODE',
            qrCodeId: bankAccount.id,
            createdBy: user.id,
          });
        }
      }
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
    newUser.password = '123@123';
    newUser.email = member.email;
    newUser.refreshToken = '';
    newUser.isActive = true;
    newUser.isAdmin = false;
    newUser.memberId = member.id;
    newUser.employeeId = undefined;
    newUser.createdBy = user.id;
    newUser.createdAt = new Date();
    await this.userRepo.save(newUser);
    await this.repo.update(member.id, { userId: newUser.id });

    const actionLogDto: ActionLogCreateDto = {
      entityId: member.id,
      entityName: 'MEMBER',
      actionType: enumData.ActionLogType.CREATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `Nhân viên ${user.username} tạo mới thành viên: ${member.code}`,
      oldValue: '{}',
      newValue: JSON.stringify(member),
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
      await this.fileArchivalService.removeByFk('memberId', member.id);
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
          await this.fileArchivalService.create({
            fileUrl,
            fileName: fileName || 'avatar.jpg',
            fileType: 'MEMBER_AVATAR',
            memberId: member.id,
            createdBy: user.id,
          });
        }
      }
    }

    if (updateDto.bankAccounts !== undefined) {
      const oldBankAccounts = await this.bankAccountRepo.find({
        where: { memberId: member.id },
        relations: { qrCode: true },
      });

      for (const acc of oldBankAccounts) {
        await this.fileArchivalService.removeByFk('qrCodeId', acc.id);
      }
      await this.bankAccountRepo.delete({ memberId: member.id });

      for (const bankAcc of updateDto.bankAccounts) {
        const bankAccount = new MemberBankAccountEntity();
        bankAccount.id = uuidv4();
        bankAccount.memberId = member.id;
        bankAccount.bankName = bankAcc.bankName;
        bankAccount.bankAccountNo = bankAcc.bankAccountNo;
        bankAccount.bankAccountName = bankAcc.bankAccountName;
        bankAccount.createdBy = user.id;
        bankAccount.createdAt = new Date();
        await this.bankAccountRepo.save(bankAccount);

        if (bankAcc.qrCode?.fileUrl) {
          await this.fileArchivalService.create({
            fileUrl: bankAcc.qrCode.fileUrl,
            fileName:
              bankAcc.qrCode.fileName ||
              `qr_${member.code}_${bankAcc.bankName || 'bank'}`,
            fileType: 'MEMBER_QR_CODE',
            qrCodeId: bankAccount.id,
            createdBy: user.id,
          });
        }
      }
    }

    const { avatar, bankAccounts, id, ...restUpdateData } = updateDto;

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
        bankAccounts: { qrCode: true },
      },
    });

    const existingUser = await this.userRepo.findOne({
      where: { memberId: member.id },
    });
    if (existingUser) {
      const userUpdates: any = {};
      if (updateDto.email && updateDto.email !== existingUser.email)
        userUpdates.email = updateDto.email;
      if (updateDto.phone && updateDto.phone !== existingUser.username)
        userUpdates.username = updateDto.phone;
      if (Object.keys(userUpdates).length) {
        userUpdates.updatedBy = user.id;
        userUpdates.updatedAt = new Date();
        await this.userRepo.update(existingUser.id, userUpdates);
      }
    } else {
      const newUser = new UserEntity();
      newUser.id = uuidv4();
      newUser.username = updateDto.phone || updateDto.email;
      newUser.password = '123@123';
      newUser.email = updateDto.email;
      newUser.refreshToken = '';
      newUser.isActive = true;
      newUser.isAdmin = false;
      newUser.memberId = member.id;
      newUser.createdBy = user.id;
      newUser.createdAt = new Date();
      await this.userRepo.save(newUser);
      await this.repo.update(member.id, { userId: newUser.id });
    }

    const actionLogDto: ActionLogCreateDto = {
      entityId: member.id,
      entityName: 'MEMBER',
      actionType: enumData.ActionLogType.UPDATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `Nhân viên ${user.username} cập nhật thông tin thành viên: ${member.code}`,
      oldValue: JSON.stringify(member),
      newValue: JSON.stringify(updatedMember),
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
      entityId: member.id,
      entityName: 'MEMBER',
      actionType: enumData.ActionLogType.DEACTIVATE.code,
      createdById: user.id,
      createdByCode: user.code,
      createdByName: user.username,
      createdNote: `Nhân viên ${user.username} ngừng hoạt động thành viên với code: ${member.code}`,
      oldValue: JSON.stringify(member),
      newValue: JSON.stringify({
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
      entityId: member.id,
      entityName: 'MEMBER',
      actionType: enumData.ActionLogType.ACTIVATE.code,
      createdById: user.id,
      createdByCode: user.code,
      createdByName: user.username,
      createdNote: `Nhân viên ${user.username} kích hoạt thành viên với code: ${member.code}`,
      oldValue: JSON.stringify(member),
      newValue: JSON.stringify({
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
}
