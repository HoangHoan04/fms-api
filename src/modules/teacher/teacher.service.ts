import { enumData } from '@/common/contanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { EmployeeEntity, UserEntity } from '@/entities/users';
import { transformKeys } from '@/helpers';
import {
  EmployeeRepository,
  FileArchivalRepository,
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
import {
  CreateEmployeeDto,
  UpdateEmployeeAvatarDto,
  UpdateEmployeeDto,
} from './dto';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly repo: EmployeeRepository,
    private readonly userRepo: UserRepository,
    private readonly fileArchivalService: FileArchivalService,
    private readonly actionLogService: ActionLogService,
    private readonly fileArchivalRepo: FileArchivalRepository,
  ) {}

  private genCodeEmployee() {
    const generate = customAlphabet('0123456789', 5);
    return `GV-${generate()}`;
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
      throw new NotFoundException('Không tìm thấy giảng viên');
    }
    const userEntity = result.user;
    let safeUser: any = null;
    if (userEntity) {
      const tempUser = { ...userEntity };
      delete (tempUser as any).password;
      delete (tempUser as any).refreshToken;
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

    const res = transformKeys(finalData);

    return {
      message: 'Tìm kiếm giảng viên thành công',
      data: res,
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
    const whereCon: FindOptionsWhere<EmployeeEntity> = {};

    if (data.where.code) whereCon.code = ILike(`%${data.where.code}%`);
    if (data.where.fullName)
      whereCon.fullName = ILike(`%${data.where.fullName}%`);
    if (data.where.phone) whereCon.phone = ILike(`%${data.where.phone}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [employees, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: employees,
      total,
    };
  }

  async create(user: UserDto, createDto: CreateEmployeeDto) {
    const existingEmployee = await this.repo.findOne({
      where: [
        { email: createDto.email, isDeleted: false },
        { phone: createDto.phone, isDeleted: false },
      ],
    });
    if (existingEmployee)
      throw new Error('Email hoặc số điện thoại giảng viên đã tồn tại');

    const employee = new EmployeeEntity();
    employee.id = uuidv4();
    employee.code = this.genCodeEmployee();
    employee.fullName = createDto.fullName;
    employee.phone = createDto.phone;
    employee.gender = createDto.gender;
    employee.email = createDto.email;
    employee.birthday = createDto.birthday;
    employee.bio = createDto.bio;
    employee.specialties = createDto.specialties;
    employee.certifications = createDto.certifications;
    employee.yearsExperience = createDto.yearsExperience;
    employee.createdBy = user.id;
    employee.createdAt = new Date();

    await this.repo.save(employee);

    const avatarData = Array.isArray(createDto.avatar)
      ? createDto.avatar[0]
      : createDto.avatar;
    if (avatarData?.fileUrl && avatarData?.fileName) {
      const fileArchival: FileArchivalCreateDto = {
        fileUrl: avatarData.fileUrl,
        fileName: avatarData.fileName,
        fileType: 'TEACHER_AVATAR',
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        fileRelationName: 'employeeId',
        fileRelationId: employee.id,
      };
      await this.fileArchivalService.create(fileArchival);
    }

    const existingUser = await this.userRepo.findOne({
      where: { username: employee.phone },
    });
    if (existingUser) {
      throw new BadRequestException('Người dùng đã tồn tại!');
    }

    const newUser = new UserEntity();
    newUser.id = uuidv4();
    newUser.username = employee.phone || employee.email;
    newUser.password = '123456';
    newUser.email = employee.email;
    newUser.isActive = true;
    newUser.isAdmin = false;
    newUser.employeeId = employee.id;
    newUser.memberId = undefined;
    newUser.createdBy = user.id;
    newUser.createdAt = new Date();
    await this.userRepo.save(newUser);
    await this.repo.update(employee.id, { userId: newUser.id });

    const actionLogDto: ActionLogCreateDto = {
      functionId: employee.id,
      functionType: 'TEACHER',
      type: enumData.ActionLogType.CREATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      description: `Tạo mới giảng viên: ${employee.code}`,
      oldData: '{}',
      newData: JSON.stringify(employee),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới giảng viên thành công',
    };
  }

  async update(user: UserDto, updateDto: UpdateEmployeeDto) {
    const employee = await this.repo.findOne({
      where: { id: updateDto.id },
    });

    if (!employee) {
      throw new NotFoundException('Không tìm thấy giảng viên');
    }

    if (updateDto.avatar !== undefined) {
      await this.fileArchivalRepo.delete({ employeeId: employee.id });
      const avatarData = Array.isArray(updateDto.avatar)
        ? updateDto.avatar[0]
        : updateDto.avatar;

      if (avatarData) {
        const fileUrl =
          typeof avatarData === 'string' ? avatarData : avatarData.fileUrl;
        const fileName =
          typeof avatarData === 'string'
            ? `avatar_${employee.code}`
            : avatarData.fileName;

        if (fileUrl) {
          const fileArchivalDto: FileArchivalCreateDto = {
            fileUrl,
            fileName: fileName || 'avatar.jpg',
            fileType: 'TEACHER_AVATAR',
            fileRelationName: 'employeeId',
            fileRelationId: employee.id,
            createdBy: user.id,
            createdAt: new Date().toISOString(),
          };
          await this.fileArchivalService.create(fileArchivalDto);
        }
      }
    }

    const { avatar, id, ...restUpdateData } = updateDto;

    const employeeUpdateData: any = {
      ...restUpdateData,
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    await this.repo.update(employee.id, employeeUpdateData);

    const updatedEmployee = await this.repo.findOne({
      where: { id: employee.id },
      relations: {
        avatar: true,
        user: true,
      },
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: employee.id,
      functionType: 'TEACHER',
      type: enumData.ActionLogType.UPDATE.code,
      createdById: user.id,
      createdByCode: user.code,
      createdByName: user.username,
      description: `Cập nhật thông tin giảng viên: ${employee.code}`,
      oldData: JSON.stringify(employee),
      newData: JSON.stringify(updatedEmployee),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật giảng viên thành công',
      data: transformKeys(updatedEmployee),
    };
  }

  async deactivate(user: UserDto, id: string) {
    const employee = await this.repo.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Không tìm thấy giảng viên');
    }

    await this.repo.update(id, { isDeleted: true });

    const employeeUsers = await this.userRepo.find({
      where: { employeeId: id },
    });

    if (employeeUsers.length) {
      await this.userRepo.update(
        { employeeId: id },
        {
          isDeleted: true,
          isActive: false,
          updatedBy: user.id,
          updatedAt: new Date(),
        },
      );
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: employee.id,
      functionType: 'TEACHER',
      type: enumData.ActionLogType.DEACTIVATE.code,
      createdById: user.id,
      createdByCode: user.code,
      createdByName: user.username,
      description: `Ngừng hoạt động giảng viên với code: ${employee.code}`,
      oldData: JSON.stringify(employee),
      newData: JSON.stringify({
        ...employee,
        isDeleted: true,
        users: employeeUsers.map((u) => ({
          id: u.id,
          isDeleted: true,
          isActive: false,
        })),
      }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Ngừng hoạt động giảng viên thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const employee = await this.repo.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Không tìm thấy giảng viên');
    }

    const employeeUsers = await this.userRepo.find({
      where: { employeeId: id },
    });

    await this.repo.update(id, { isDeleted: false });
    if (employeeUsers.length) {
      await this.userRepo.update(
        { employeeId: id },
        {
          isDeleted: false,
          isActive: true,
        },
      );
    }
    const actionLogDto: ActionLogCreateDto = {
      functionId: employee.id,
      functionType: 'TEACHER',
      type: enumData.ActionLogType.ACTIVATE.code,
      createdById: user.id,
      createdByCode: user.code,
      createdByName: user.username,
      description: `Kích hoạt giảng viên với code: ${employee.code}`,
      oldData: JSON.stringify(employee),
      newData: JSON.stringify({
        ...employee,
        isDeleted: false,
        users: employeeUsers.map((u) => ({
          id: u.id,
          isDeleted: false,
          isActive: true,
        })),
      }),
    };

    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Kích hoạt giảng viên thành công',
    };
  }

  async findByCodes(codes: string[]): Promise<EmployeeEntity[]> {
    return await this.repo.find({
      where: {
        code: In(codes),
        isDeleted: false,
      },
    });
  }

  async findByIds(ids: string[]): Promise<EmployeeEntity[]> {
    return await this.repo.find({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });
  }

  async findByPhones(phones: string[]): Promise<EmployeeEntity[]> {
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

    const filtered = res.filter((s) => s.id !== user.employeeId);
    return filtered;
  }

  async updateAvatar(user: UserDto, data: UpdateEmployeeAvatarDto) {
    const checkEmployee = await this.repo.findOne({
      where: { id: user.employeeId },
    });
    if (!checkEmployee)
      throw new NotFoundException('Không tìm thấy giảng viên');

    await this.fileArchivalRepo.delete({ employeeId: checkEmployee.id });

    const fileArchival = new FileArchivalCreateDto();
    fileArchival.createdBy = user.id;
    fileArchival.fileUrl = data.avatarUrl;
    fileArchival.fileName = 'avatarUrl';
    fileArchival.fileType = 'TEACHER_AVATAR';
    fileArchival.fileRelationName = 'employeeId';
    fileArchival.fileRelationId = checkEmployee.id;
    fileArchival.createdAt = new Date().toISOString();
    await this.fileArchivalService.create(fileArchival);

    return {
      message: 'Cập nhật ảnh đại diện thành công',
    };
  }
}
