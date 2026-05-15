import { enumData } from '@/common/contanst/enumData';
import { coreHelper, transformKeys } from '@/helpers';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { EmployeeEntity, UserEntity } from '@/entities/users';
import { EmployeeRepository, UserRepository } from '@/repositories';
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
  ) {}

  private genCodeEmployee(): string {
    const generate = customAlphabet('0123456789', 5);
    return `EMP-${generate()}`;
  }

  async findById(data: IdDto) {
    const result = await this.repo.findOne({
      where: { id: data.id },
      relations: {
        avatar: true,
        user: true,
        managedFunds: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy nhân viên');
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

    const finalData = {
      ...result,
      avatar: avatarArray,
      user: safeUser,
      totalManagedFunds: result.managedFunds?.length || 0,
    };

    return {
      message: 'Tìm kiếm nhân viên thành công',
      data: transformKeys(finalData),
    };
  }

  async selectBox() {
    const res: any[] = await this.repo.find({
      where: { isDeleted: false },
      select: {
        id: true,
        code: true,
        fullName: true,
        email: true,
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
    if (data.where.email) whereCon.email = ILike(`%${data.where.email}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [employees, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return { data: employees, total };
  }

  async create(user: UserDto, createDto: CreateEmployeeDto) {
    const existingEmployee = await this.repo.findOne({
      where: [
        { email: createDto.email, isDeleted: false },
        { phone: createDto.phone, isDeleted: false },
      ],
    });
    if (existingEmployee) {
      throw new BadRequestException(
        'Email hoặc số điện thoại nhân viên đã tồn tại',
      );
    }

    const employee = new EmployeeEntity();
    employee.id = uuidv4();
    employee.code = this.genCodeEmployee();
    employee.fullName = createDto.fullName;
    employee.shortName = createDto.shortName;
    employee.phone = createDto.phone;
    employee.gender = createDto.gender;
    employee.email = createDto.email;
    employee.birthday = createDto.birthday;
    employee.description = createDto.description;
    employee.createdBy = user.id;
    employee.createdAt = coreHelper.newDateTZ();

    await this.repo.save(employee);

    const avatarData = Array.isArray(createDto.avatar)
      ? createDto.avatar[0]
      : createDto.avatar;
    if (avatarData?.fileUrl && avatarData?.fileName) {
      await this.fileArchivalService.create({
        fileUrl: avatarData.fileUrl,
        fileName: avatarData.fileName,
        fileType: 'EMPLOYEE_AVATAR',
        employeeId: employee.id,
        createdBy: user.id,
      });
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
    newUser.password = '123@123';
    newUser.email = employee.email;
    newUser.refreshToken = '';
    newUser.isActive = true;
    newUser.isAdmin = false;
    newUser.employeeId = employee.id;
    newUser.createdBy = user.id;
    newUser.createdAt = coreHelper.newDateTZ();
    await this.userRepo.save(newUser);
    await this.repo.update(employee.id, { userId: newUser.id });

    const actionLogDto: ActionLogCreateDto = {
      entityId: employee.id,
      entityName: 'EMPLOYEE',
      actionType: enumData.ActionLogType.CREATE.code,
      createdById: user.id,
      createdByCode: user.username,
      createdByName: user.username,
      createdNote: `${user.username} tạo mới nhân viên: ${employee.code}`,
      oldValue: '{}',
      newValue: JSON.stringify(employee),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Tạo mới nhân viên thành công' };
  }

  async update(user: UserDto, updateDto: UpdateEmployeeDto) {
    const employee = await this.repo.findOne({
      where: { id: updateDto.id },
    });
    if (!employee) {
      throw new NotFoundException('Không tìm thấy nhân viên');
    }

    if (updateDto.avatar !== undefined) {
      await this.fileArchivalService.removeByFk('employeeId', employee.id);
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
          await this.fileArchivalService.create({
            fileUrl,
            fileName: fileName || 'avatar.jpg',
            fileType: 'EMPLOYEE_AVATAR',
            employeeId: employee.id,
            createdBy: user.id,
          });
        }
      }
    }

    const { avatar, id, ...restUpdateData } = updateDto;

    const employeeUpdateData: any = {
      ...restUpdateData,
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
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
      entityId: employee.id,
      entityName: 'EMPLOYEE',
      actionType: enumData.ActionLogType.UPDATE.code,
      createdById: user.id,
      createdByCode: user.code,
      createdByName: user.username,
      createdNote: `${user.username} cập nhật thông tin nhân viên: ${employee.code}`,
      oldValue: JSON.stringify(employee),
      newValue: JSON.stringify(updatedEmployee),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật nhân viên thành công',
      data: transformKeys(updatedEmployee),
    };
  }

  async deactivate(user: UserDto, id: string) {
    const employee = await this.repo.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Không tìm thấy nhân viên');
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
          updatedAt: coreHelper.newDateTZ(),
        },
      );
    }

    const actionLogDto: ActionLogCreateDto = {
      entityId: employee.id,
      entityName: 'EMPLOYEE',
      actionType: enumData.ActionLogType.DEACTIVATE.code,
      createdById: user.id,
      createdByCode: user.code,
      createdByName: user.username,
      createdNote: `${user.username} ngừng hoạt động nhân viên: ${employee.code}`,
      oldValue: JSON.stringify(employee),
      newValue: JSON.stringify({
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

    return { message: 'Ngừng hoạt động nhân viên thành công' };
  }

  async activate(user: UserDto, id: string) {
    const employee = await this.repo.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Không tìm thấy nhân viên');
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
      entityId: employee.id,
      entityName: 'EMPLOYEE',
      actionType: enumData.ActionLogType.ACTIVATE.code,
      createdById: user.id,
      createdByCode: user.code,
      createdByName: user.username,
      createdNote: `${user.username} kích hoạt nhân viên: ${employee.code}`,
      oldValue: JSON.stringify(employee),
      newValue: JSON.stringify({
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
    return { message: 'Kích hoạt nhân viên thành công' };
  }

  async findByCodes(codes: string[]): Promise<EmployeeEntity[]> {
    return await this.repo.find({
      where: { code: In(codes), isDeleted: false },
    });
  }

  async findByIds(ids: string[]): Promise<EmployeeEntity[]> {
    return await this.repo.find({
      where: { id: In(ids), isDeleted: false },
    });
  }

  async findByPhones(phones: string[]): Promise<EmployeeEntity[]> {
    return await this.repo.find({
      where: { phone: In(phones), isDeleted: false },
    });
  }

  async findByPhoneEmail(phone: string, email: string, user: UserDto) {
    const res = await this.repo.find({
      where: [
        { phone: phone, isDeleted: false },
        { email: email, isDeleted: false },
      ],
    });
    return res.filter((s) => s.id !== user.employeeId);
  }

  async updateAvatar(user: UserDto, data: UpdateEmployeeAvatarDto) {
    const checkEmployee = await this.repo.findOne({
      where: { id: user.employeeId },
    });
    if (!checkEmployee) throw new NotFoundException('Không tìm thấy nhân viên');

    await this.fileArchivalService.removeByFk('employeeId', checkEmployee.id);

    await this.fileArchivalService.create({
      fileUrl: data.avatarUrl,
      fileName: `avatar_${checkEmployee.code}`,
      fileType: 'EMPLOYEE_AVATAR',
      employeeId: checkEmployee.id,
      createdBy: user.id,
    });

    return { message: 'Cập nhật ảnh đại diện thành công' };
  }

  async findByEmail(email: string): Promise<EmployeeEntity | null> {
    return await this.repo.findOne({
      where: { email, isDeleted: false },
    });
  }
}
