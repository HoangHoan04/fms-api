import { IdDto, PaginationDto, UserDto } from '@/dto';
import {
  NotificationRepository,
  NotificationTemplateRepository,
  UserRepository,
} from '@/repositories';
import { Injectable } from '@nestjs/common';
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

  async create(dto: CreateNotificationDto) {}

  async findById(data: IdDto) {}

  async pagination(data: PaginationDto<FilterNotificationDto>) {}

  async countUnread(user: UserDto) {}

  async markAsRead(data: IdDto, user: UserDto) {}

  async markAllAsRead(user: UserDto) {}

  async markListAsRead(user: UserDto, dto: MarkAsReadDto) {}

  async deactivate(data: IdDto) {}

  async createNotifyAdmin(dto: CreateNotifyAdminDto) {}

  async createNotifyForUsers(dto: CreateNotifyForUsersDto) {}

  async sendFromTemplate(dto: SendFromTemplateDto) {}

  // ==================== NOTIFICATION TEMPLATES ====================

  async createTemplate(dto: CreateTemplateDto) {}

  async updateTemplate(dto: UpdateTemplateDto) {}

  async findTemplateById(data: IdDto) {}

  async findTemplateByCode(code: string) {}

  async paginationTemplate(data: PaginationDto<FilterTemplateDto>) {}

  async deactivateTemplate(data: IdDto) {}

  async renderTemplate(dto: RenderTemplateDto) {}

  private renderText(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const value = variables[key];
      if (value === null || value === undefined) return `{{${key}}}`;
      return String(value);
    });
  }
}
