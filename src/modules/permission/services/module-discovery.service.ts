import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { PermissionRepository } from '@/repositories/user.repository';
import { v4 as uuidv4 } from 'uuid';

export interface ModuleActionInfo {
  module: string;
  actions: string[];
}

const ACTION_MAPPING: Record<string, string> = {
  pagination: 'VIEW_LIST',
  list: 'VIEW_LIST',
  detail: 'VIEW_DETAIL',
  create: 'CREATED',
  update: 'EDITED',
  edit: 'EDITED',
  delete: 'DELETED',
  deactivate: 'DEACTIVATED',
  activate: 'ACTIVATED',
  'select-box': 'SELECT_BOX',
  'export-excel': 'EXPORTED',
  'import-excel': 'IMPORTED',
  publish: 'PUBLISHED',
  unpublish: 'UNPUBLISHED',
  approve: 'APPROVED',
  reject: 'REJECTED',
  moderate: 'MODERATED',
  assign: 'ASSIGN',
  archive: 'ARCHIVED',
  unarchive: 'UNARCHIVED',
  restore: 'RESTORED',
  'change-password': 'CHANGE_PASSWORD',
  'change-status': 'CHANGE_STATUS',
  'update-profile': 'UPDATE_PROFILE',
  'update-avatar': 'UPDATE_AVATAR',
  'update-settings': 'UPDATE_SETTINGS',
  'get-settings': 'VIEW_SETTINGS',
  me: 'VIEW_PROFILE',
  login: 'LOGIN',
  logout: 'LOGOUT',
  'refresh-token': 'REFRESH_TOKEN',
};

@Injectable()
export class ModuleDiscoveryService implements OnModuleInit {
  private discovered: ModuleActionInfo[] = [];

  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly permissionRepo: PermissionRepository,
  ) {}

  onModuleInit() {
    this.scan();
  }

  private scan() {
    const moduleMap = new Map<string, Set<string>>();

    for (const moduleRef of this.modulesContainer.values()) {
      const controllers = moduleRef.controllers;

      for (const [name, wrapper] of controllers) {
        const { metatype, instance } = wrapper;
        if (!metatype || !instance) continue;

        const controllerPath: string = Reflect.getMetadata('path', metatype);
        if (!controllerPath) continue;

        const moduleName = this.toModuleName(controllerPath);
        if (!moduleName) continue;

        const prototype = Object.getPrototypeOf(instance);
        const methodNames = Object.getOwnPropertyNames(prototype).filter(
          (n) => n !== 'constructor' && typeof prototype[n] === 'function',
        );

        const actions = new Set<string>();

        for (const methodName of methodNames) {
          const handler = prototype[methodName];
          const handlerPath: string | undefined = Reflect.getMetadata(
            'path',
            handler,
          );

          if (handlerPath !== undefined) {
            const rawPath =
              typeof handlerPath === 'string' ? handlerPath : methodName;
            const mapped = this.mapAction(rawPath);
            actions.add(mapped);
          }
        }

        if (actions.size > 0) {
          const existing = moduleMap.get(moduleName);
          if (existing) {
            actions.forEach((a) => existing.add(a));
          } else {
            moduleMap.set(moduleName, actions);
          }
        }
      }
    }

    this.discovered = Array.from(moduleMap.entries())
      .map(([module, actions]) => ({
        module,
        actions: Array.from(actions).sort(),
      }))
      .sort((a, b) => a.module.localeCompare(b.module));
  }

  private toModuleName(path: string): string {
    return path
      .replace(/[-_\s]+/g, ' ')
      .replace(/\/(create|update|delete|detail|pagination).*$/, '')
      .split(/[\s/]+/)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .filter(Boolean)
      .join(' ');
  }

  private mapAction(rawPath: string): string {
    const clean = rawPath.replace(/[:/].*$/, '').replace(/^-+|-+$/g, '');
    return (
      ACTION_MAPPING[clean] || clean.replace(/[-_\s]+/g, '_').toUpperCase()
    );
  }

  getDiscoveredModules(): ModuleActionInfo[] {
    return [...this.discovered];
  }

  async getModuleActions(): Promise<ModuleActionInfo[]> {
    const moduleMap = new Map<string, Set<string>>();

    for (const { module, actions } of this.discovered) {
      moduleMap.set(module, new Set(actions));
    }

    const dbModules = await this.permissionRepo.find({
      where: { isDeleted: false },
      select: ['module', 'action'],
    });

    for (const perm of dbModules) {
      if (perm.module) {
        const existing = moduleMap.get(perm.module);
        if (existing) {
          if (perm.action) existing.add(perm.action);
        } else {
          moduleMap.set(perm.module, new Set(perm.action ? [perm.action] : []));
        }
      }
    }

    return Array.from(moduleMap.entries())
      .map(([module, actions]) => ({
        module,
        actions: Array.from(actions).sort(),
      }))
      .sort((a, b) => a.module.localeCompare(b.module));
  }

  async syncPermissions(userId: string): Promise<{
    created: number;
    skipped: number;
    modules: ModuleActionInfo[];
  }> {
    const allExisting = await this.permissionRepo.find({
      where: { isDeleted: false },
      select: ['code', 'module', 'action'],
    });
    const existingCodes = new Set(allExisting.map((p) => p.code));
    const existingModuleActions = new Set(
      allExisting
        .filter((p) => p.module && p.action)
        .map((p) => `${p.module}:${p.action}`),
    );

    const moduleMap = new Map<string, Set<string>>();

    for (const { module, actions } of this.discovered) {
      moduleMap.set(module, new Set(actions));
    }

    let created = 0;
    let skipped = 0;

    for (const [module, actions] of moduleMap) {
      for (const action of actions) {
        const key = `${module}:${action}`;
        if (existingModuleActions.has(key)) {
          skipped++;
          continue;
        }

        const code = `${module.toUpperCase().replace(/\s+/g, '_')}:${action}`;
        if (existingCodes.has(code)) {
          skipped++;
          continue;
        }

        const entity = this.permissionRepo.create({
          id: uuidv4(),
          code,
          name: `${module} - ${this.getActionLabel(action)}`,
          module,
          action,
          createdBy: userId,
        });
        await this.permissionRepo.save(entity);
        created++;
      }
    }

    const modules = Array.from(moduleMap.entries())
      .map(([module, actions]) => ({
        module,
        actions: Array.from(actions).sort(),
      }))
      .sort((a, b) => a.module.localeCompare(b.module));

    return { created, skipped, modules };
  }

  private getActionLabel(action: string): string {
    const labels: Record<string, string> = {
      VIEW_LIST: 'Xem danh sách',
      VIEW_DETAIL: 'Xem chi tiết',
      CREATED: 'Thêm mới',
      EDITED: 'Chỉnh sửa',
      DELETED: 'Xoá',
      ACTIVATED: 'Kích hoạt',
      DEACTIVATED: 'Ngưng hoạt động',
      PUBLISHED: 'Xuất bản',
      UNPUBLISHED: 'Huỷ xuất bản',
      APPROVED: 'Phê duyệt',
      REJECTED: 'Từ chối',
      MODERATED: 'Kiểm duyệt',
      ASSIGN: 'Gán quyền',
      EXPORTED: 'Xuất dữ liệu',
      IMPORTED: 'Nhập dữ liệu',
      SELECT_BOX: 'Danh sách select',
      LOGIN: 'Đăng nhập',
      LOGOUT: 'Đăng xuất',
      VIEW_PROFILE: 'Xem hồ sơ',
      CHANGE_PASSWORD: 'Đổi mật khẩu',
      CHANGE_STATUS: 'Đổi trạng thái',
      UPDATE_PROFILE: 'Cập nhật hồ sơ',
      UPDATE_AVATAR: 'Cập nhật avatar',
      ARCHIVED: 'Lưu trữ',
      UNARCHIVED: 'Huỷ lưu trữ',
      RESTORED: 'Khôi phục',
      VIEW_SETTINGS: 'Xem cài đặt',
      UPDATE_SETTINGS: 'Cập nhật cài đặt',
      REFRESH_TOKEN: 'Làm mới token',
    };
    return labels[action] || action;
  }
}
