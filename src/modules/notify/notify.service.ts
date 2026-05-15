import { coreHelper, transformKeys } from '@/helpers';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import {
  NotificationEntity,
  NotificationTemplateEntity,
} from '@/entities/notify';
import {
  NotificationRepository,
  NotificationTemplateRepository,
  UserRepository,
} from '@/repositories';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateNotificationDto,
  CreateNotifyAdminDto,
  CreateNotifyForUsersDto,
  CreateTemplateDto,
  FilterNotificationDto,
  FilterTemplateDto,
  MarkAsReadDto,
  RenderTemplateDto,
  SendFromTemplateDto,
  UpdateTemplateDto,
} from './dto';

@Injectable()
export class NotifyService {
  constructor(
    private readonly repo: NotificationRepository,
    private readonly templateRepo: NotificationTemplateRepository,
    private readonly userRepo: UserRepository,
  ) {}

  // ==================== NOTIFICATIONS ====================

  async create(dto: CreateNotificationDto) {
    const notification = new NotificationEntity();
    notification.id = uuidv4();
    notification.userId = dto.userId;
    notification.templateId = dto.templateId;
    notification.title = dto.title;
    notification.body = dto.body;
    notification.payload = dto.payload;
    notification.channel = dto.channel || 'push';
    notification.isRead = false;
    notification.sentAt = coreHelper.newDateTZ();
    notification.relatedEntityType = dto.relatedEntityType;
    notification.relatedEntityId = dto.relatedEntityId;
    notification.createdBy = 'system';
    notification.createdAt = coreHelper.newDateTZ();

    await this.repo.save(notification);

    return { message: 'Tạo thông báo thành công', data: notification };
  }

  async findById(data: IdDto) {
    const result = await this.repo.findOne({
      where: { id: data.id },
      relations: {
        user: true,
        template: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    return {
      message: 'Tìm thông báo thành công',
      data: transformKeys(result),
    };
  }

  async pagination(data: PaginationDto<FilterNotificationDto>) {
    const whereCon: FindOptionsWhere<NotificationEntity> = {};
    const filter = data.where;

    if (filter?.userId) whereCon.userId = filter.userId;
    if (filter?.channel) whereCon.channel = filter.channel;
    if (filter?.relatedEntityType)
      whereCon.relatedEntityType = filter.relatedEntityType;
    if (filter?.relatedEntityId)
      whereCon.relatedEntityId = filter.relatedEntityId;
    if (filter && [true, false].includes(filter.isRead as boolean))
      whereCon.isRead = filter.isRead;

    const [notifications, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: {
        user: true,
        template: true,
      },
    });

    return { data: notifications, total };
  }

  async countUnread(user: UserDto) {
    const count = await this.repo.count({
      where: { userId: user.id, isRead: false },
    });
    return { count };
  }

  async markAsRead(id: string, user: UserDto) {
    const notification = await this.repo.findOne({
      where: { id, userId: user.id },
    });
    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    await this.repo.update(id, {
      isRead: true,
      readAt: coreHelper.newDateTZ(),
      updatedBy: user.id,
      updatedAt: coreHelper.newDateTZ(),
    });

    return { message: 'Đã đánh dấu đã đọc' };
  }

  async markAllAsRead(user: UserDto) {
    await this.repo.update(
      { userId: user.id, isRead: false },
      {
        isRead: true,
        readAt: coreHelper.newDateTZ(),
        updatedBy: user.id,
        updatedAt: coreHelper.newDateTZ(),
      },
    );

    return { message: 'Đã đánh dấu tất cả là đã đọc' };
  }

  async markListAsRead(user: UserDto, dto: MarkAsReadDto) {
    if (!dto.ids?.length) {
      return { message: 'Danh sách ID trống' };
    }

    await this.repo.update(
      {
        userId: user.id,
        id: In(dto.ids),
        isRead: false,
      },
      {
        isRead: true,
        readAt: coreHelper.newDateTZ(),
        updatedBy: user.id,
        updatedAt: coreHelper.newDateTZ(),
      },
    );

    return { message: 'Cập nhật trạng thái thành công' };
  }

  async softDelete(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    await this.repo.update(id, { isDeleted: true });
    return { message: 'Xóa thông báo thành công' };
  }

  async createNotifyAdmin(dto: CreateNotifyAdminDto) {
    const admins = await this.userRepo.find({
      where: { isAdmin: true, isDeleted: false },
      select: { id: true },
    });

    if (admins.length === 0) {
      return { message: 'Không có admin nào trong hệ thống' };
    }

    const entities = admins.map((admin) => {
      const notification = new NotificationEntity();
      notification.id = uuidv4();
      notification.userId = admin.id;
      notification.title = dto.title;
      notification.body = dto.description;
      notification.payload = {
        category: dto.category,
        colorType: dto.colorType || 'BLUE',
        callbackUrl: dto.callbackUrl || null,
        titleEn: dto.titleEn || null,
        descriptionEn: dto.descriptionEn || null,
        notifyPermissionType: dto.notifyPermissionType || null,
      };
      notification.channel = 'push';
      notification.isRead = false;
      notification.sentAt = coreHelper.newDateTZ();
      notification.createdBy = 'system';
      notification.createdAt = coreHelper.newDateTZ();
      return notification;
    });

    await this.repo.save(entities);

    return { message: 'Gửi thông báo tới admin thành công' };
  }

  async createNotifyForUsers(dto: CreateNotifyForUsersDto) {
    if (!dto.userIds?.length) {
      return { message: 'Danh sách người nhận trống' };
    }

    const existingUsers = await this.userRepo.find({
      where: { id: In(dto.userIds), isDeleted: false },
      select: { id: true },
    });

    if (existingUsers.length === 0) {
      throw new BadRequestException('Không tìm thấy người dùng hợp lệ');
    }

    const entities = existingUsers.map((user) => {
      const notification = new NotificationEntity();
      notification.id = uuidv4();
      notification.userId = user.id;
      notification.title = dto.title;
      notification.body = dto.body;
      notification.payload = dto.payload;
      notification.channel = dto.channel || 'push';
      notification.isRead = false;
      notification.sentAt = coreHelper.newDateTZ();
      notification.relatedEntityType = dto.relatedEntityType;
      notification.relatedEntityId = dto.relatedEntityId;
      notification.createdBy = 'system';
      notification.createdAt = coreHelper.newDateTZ();
      return notification;
    });

    await this.repo.save(entities);

    return {
      message: `Đã gửi thông báo tới ${entities.length} người dùng`,
      sentCount: entities.length,
    };
  }

  async sendFromTemplate(dto: SendFromTemplateDto) {
    const template = await this.templateRepo.findOne({
      where: { code: dto.templateCode, isDeleted: false },
    });

    if (!template) {
      throw new NotFoundException(
        `Không tìm thấy mẫu thông báo: ${dto.templateCode}`,
      );
    }

    const renderedTitle = this.renderText(template.title, dto.variables);
    const renderedBody = template.body
      ? this.renderText(template.body, dto.variables)
      : undefined;

    const existingUsers = await this.userRepo.find({
      where: { id: In(dto.userIds), isDeleted: false },
      select: { id: true },
    });

    if (existingUsers.length === 0) {
      throw new BadRequestException('Không tìm thấy người dùng hợp lệ');
    }

    const entities = existingUsers.map((user) => {
      const notification = new NotificationEntity();
      notification.id = uuidv4();
      notification.userId = user.id;
      notification.templateId = template.id;
      notification.title = renderedTitle;
      notification.body = renderedBody;
      notification.payload = dto.payload;
      notification.channel = template.channel || 'push';
      notification.isRead = false;
      notification.sentAt = coreHelper.newDateTZ();
      notification.relatedEntityType = dto.relatedEntityType;
      notification.relatedEntityId = dto.relatedEntityId;
      notification.createdBy = 'system';
      notification.createdAt = coreHelper.newDateTZ();
      return notification;
    });

    await this.repo.save(entities);

    return {
      message: `Đã gửi thông báo từ mẫu ${dto.templateCode} tới ${entities.length} người dùng`,
      sentCount: entities.length,
    };
  }

  // ==================== NOTIFICATION TEMPLATES ====================

  async createTemplate(dto: CreateTemplateDto) {
    const existing = await this.templateRepo.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new BadRequestException(`Mã mẫu "${dto.code}" đã tồn tại`);
    }

    const template = new NotificationTemplateEntity();
    template.id = uuidv4();
    template.code = dto.code;
    template.title = dto.title;
    template.body = dto.body;
    template.channel = dto.channel || 'push';
    template.eventType = dto.eventType;
    template.createdBy = 'system';
    template.createdAt = coreHelper.newDateTZ();

    await this.templateRepo.save(template);

    return { message: 'Tạo mẫu thông báo thành công', data: template };
  }

  async updateTemplate(dto: UpdateTemplateDto) {
    const template = await this.templateRepo.findOne({
      where: { id: dto.id },
    });
    if (!template) {
      throw new NotFoundException('Không tìm thấy mẫu thông báo');
    }

    if (dto.code && dto.code !== template.code) {
      const duplicate = await this.templateRepo.findOne({
        where: { code: dto.code },
      });
      if (duplicate) {
        throw new BadRequestException(`Mã mẫu "${dto.code}" đã tồn tại`);
      }
    }

    const updateData: any = {};
    if (dto.code !== undefined) updateData.code = dto.code;
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.body !== undefined) updateData.body = dto.body;
    if (dto.channel !== undefined) updateData.channel = dto.channel;
    if (dto.eventType !== undefined) updateData.eventType = dto.eventType;
    updateData.updatedBy = 'system';
    updateData.updatedAt = coreHelper.newDateTZ();

    await this.templateRepo.update(dto.id, updateData);

    const updated = await this.templateRepo.findOne({
      where: { id: dto.id },
    });

    return {
      message: 'Cập nhật mẫu thông báo thành công',
      data: updated,
    };
  }

  async findTemplateById(data: IdDto) {
    const result = await this.templateRepo.findOne({
      where: { id: data.id },
      relations: { notifications: true },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy mẫu thông báo');
    }

    return {
      message: 'Tìm mẫu thông báo thành công',
      data: transformKeys(result),
    };
  }

  async findTemplateByCode(code: string) {
    const result = await this.templateRepo.findOne({
      where: { code, isDeleted: false },
    });

    if (!result) {
      throw new NotFoundException(`Không tìm thấy mẫu: ${code}`);
    }

    return { data: result };
  }

  async paginationTemplate(data: PaginationDto<FilterTemplateDto>) {
    const whereCon: FindOptionsWhere<NotificationTemplateEntity> = {};
    const filter = data.where;

    if (filter?.code) whereCon.code = ILike(`%${filter.code}%`);
    if (filter?.eventType) whereCon.eventType = ILike(`%${filter.eventType}%`);
    if (filter && [true, false].includes(filter.isDeleted as boolean))
      whereCon.isDeleted = filter.isDeleted;

    const [templates, total] = await this.templateRepo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return { data: templates, total };
  }

  async deleteTemplate(id: string) {
    const template = await this.templateRepo.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException('Không tìm thấy mẫu thông báo');
    }

    await this.templateRepo.update(id, { isDeleted: true });
    return { message: 'Xóa mẫu thông báo thành công' };
  }

  async renderTemplate(dto: RenderTemplateDto) {
    const template = await this.templateRepo.findOne({
      where: { code: dto.templateCode, isDeleted: false },
    });

    if (!template) {
      throw new NotFoundException(`Không tìm thấy mẫu: ${dto.templateCode}`);
    }

    return {
      templateCode: template.code,
      renderedTitle: this.renderText(template.title, dto.variables),
      renderedBody: template.body
        ? this.renderText(template.body, dto.variables)
        : null,
      channel: template.channel,
    };
  }

  // ==================== HELPERS ====================

  private renderText(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const value = variables[key];
      if (value === null || value === undefined) return `{{${key}}}`;
      return String(value);
    });
  }
}
