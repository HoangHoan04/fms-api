import { enumData } from '@/common/contanst/enumData';
import { PaginationDto, UserDto } from '@/dto';
import { NotifyEntity } from '@/entities/notify';
import { NotifyRepository, UserRepository } from '@/repositories';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, In } from 'typeorm';
import { NotifyCreate, NotifyCreateAdmin } from './dto';

@Injectable()
export class NotifyService {
  constructor(
    private readonly repo: NotifyRepository,
    private readonly userRepo: UserRepository,
  ) {}

  private prepareNotify(
    data: any,
    userId?: string,
    memberId?: string,
  ): Partial<NotifyEntity> {
    return {
      userId,
      memberId,
      title: data.title,
      description: data.description,
      titleEn: data.titleEn,
      descriptionEn: data.descriptionEn,
      callbackUrl: data.callbackUrl,
      category: data.category,
      platform: enumData.NotifyPlatform.WEB.code,
      colorType: data.colorType || enumData.NotifyColor.BLUE.code,
      createdBy: 'system',
      isSeen: false,
    };
  }

  /** Thêm mới dữ liệu (Web) */
  async createNotifyWeb(data: NotifyCreate) {
    const { lstUserId, lstMemberId, lstEmployeeId } = data;
    let users: any[] = [];

    if (lstMemberId && lstMemberId.length > 0) {
      users = await this.userRepo.find({
        where: { memberId: In(lstMemberId) },
        select: {
          id: true,
          memberId: true,
        },
      });
    } else if (lstEmployeeId && lstEmployeeId.length > 0) {
      users = await this.userRepo.find({
        where: { employeeId: In(lstEmployeeId) },
        select: {
          id: true,
          employeeId: true,
        },
      });
    } else if (lstUserId && lstUserId.length > 0) {
      users = await this.userRepo.find({
        where: { id: In(lstUserId) },
        select: {
          id: true,
          memberId: true,
        },
      });
    }

    if (users.length === 0)
      return { message: 'Không tìm thấy người dùng phù hợp' };

    const entities = users.map((u) =>
      this.repo.create(this.prepareNotify(data, u.id, u.memberId)),
    );
    await this.repo.save(entities);

    return { message: 'Tạo thông báo thành công' };
  }

  async createNotifyAdmin(data: NotifyCreateAdmin) {
    const admins = await this.userRepo.find({
      where: { isAdmin: true, isDeleted: false },
      select: {
        id: true,
        memberId: true,
      },
    });

    if (admins.length === 0)
      return { message: 'Không có admin nào trong hệ thống' };

    const entities = admins.map((admin) =>
      this.repo.create(this.prepareNotify(data, admin.id, admin.memberId)),
    );

    await this.repo.save(entities);
    return { message: 'Gửi thông báo tới admin thành công' };
  }

  async updateSeenAll(user: UserDto) {
    await this.repo.update(
      { userId: user.id, isSeen: false },
      { isSeen: true, updatedBy: user.id },
    );

    return { message: 'Đã đánh dấu tất cả là đã đọc' };
  }

  async updateSeenListNotify(user: UserDto, data: { lstId: string[] }) {
    if (!data.lstId?.length) return { message: 'Danh sách ID trống' };

    await this.repo.update(
      {
        userId: user.id,
        id: In(data.lstId),
        isSeen: false,
      },
      { isSeen: true, updatedBy: user.id },
    );

    return { message: 'Cập nhật trạng thái thành công' };
  }

  async findCountNotiNotSeen(user: UserDto) {
    if (!user?.id) return { countAll: 0 };

    const countAll = await this.repo.count({
      where: {
        userId: user.id,
        isSeen: false,
        platform: enumData.NotifyPlatform.WEB.code,
      },
    });

    return { countAll };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<NotifyEntity> = {
      userId: data.where.userId,
      platform: enumData.NotifyPlatform.WEB.code,
    };

    if (data.where.category) {
      whereCon.category = data.where.category;
    }
    if ([true, false].includes(data.where.isSeen)) {
      whereCon.isSeen = data.where.isSeen;
    }

    const [notifies, total] = await this.repo.findAndCount({
      where: whereCon,
      order: { createdAt: 'DESC' },
      skip: data.skip,
      take: data.take,
    });

    return { data: notifies, total };
  }
}
