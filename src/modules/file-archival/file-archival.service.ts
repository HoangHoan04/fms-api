import { PaginationDto } from '@/dto';
import { FileArchivalEntity } from '@/entities';
import { transformKeys } from '@/helpers/objectHelper';
import { FileArchivalRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateFileArchivalDto,
  CreateManyFileArchivalDto,
  UpdateFileArchivalDto,
} from './dto';

@Injectable()
export class FileArchivalService {
  constructor(private repo: FileArchivalRepository) {}

  async create(dto: CreateFileArchivalDto): Promise<void> {
    const fileArchival = new FileArchivalEntity();
    fileArchival.id = uuidv4();
    fileArchival.fileName = dto.fileName;
    fileArchival.fileUrl = dto.fileUrl;
    fileArchival.fileType = dto.fileType;
    fileArchival.fileSizeBytes = dto.fileSizeBytes;
    fileArchival.extension = dto.extension;
    fileArchival.mimeType = dto.mimeType;
    fileArchival.moduleType = dto.moduleType;
    fileArchival.storageProvider = dto.storageProvider;
    fileArchival.storagePath = dto.storagePath;
    fileArchival.uploadedBy = dto.uploadedBy;
    fileArchival.createdAt = new Date();
    fileArchival.createdBy = dto.uploadedBy || 'system';
    await this.repo.save(fileArchival);
  }

  async createMany(dto: CreateManyFileArchivalDto): Promise<void> {
    const entities = dto.files.map((file) => {
      const fileArchival = new FileArchivalEntity();
      fileArchival.id = uuidv4();
      fileArchival.fileName = file.fileName;
      fileArchival.fileUrl = file.fileUrl;
      fileArchival.fileType = file.fileType;
      fileArchival.fileSizeBytes = file.fileSizeBytes;
      fileArchival.extension = file.extension;
      fileArchival.mimeType = file.mimeType;
      fileArchival.moduleType = file.moduleType;
      fileArchival.storageProvider = file.storageProvider;
      fileArchival.storagePath = file.storagePath;
      fileArchival.uploadedBy = file.uploadedBy;
      fileArchival.createdAt = new Date();
      fileArchival.createdBy = file.uploadedBy || 'system';
      return fileArchival;
    });
    await this.repo.save(entities);
  }

  async findById(id: string) {
    const result = await this.repo.findOne({
      where: { id },
      relations: { uploader: true },
    });
    if (!result) throw new NotFoundException('Không tìm thấy file');
    return { message: 'Tìm kiếm thành công', data: result };
  }

  async pagination(data: PaginationDto) {
    const { skip = 0, take = 10, where } = data;
    const whereCon: FindOptionsWhere<FileArchivalEntity> = {};

    if (where?.fileName) whereCon.fileName = where.fileName;
    if (where?.fileType) whereCon.fileType = where.fileType;
    if (where?.moduleType) whereCon.moduleType = where.moduleType;
    if (where?.storageProvider)
      whereCon.storageProvider = where.storageProvider;
    if (where?.uploadedBy) whereCon.uploadedBy = where.uploadedBy;
    if ([true, false].includes(where?.isDeleted))
      whereCon.isDeleted = where.isDeleted;

    const [items, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' },
      relations: { uploader: true },
    });
    const result = transformKeys(items);

    return { data: result, total };
  }

  async update(id: string, dto: UpdateFileArchivalDto) {
    const fileArchival = await this.repo.findOne({ where: { id } });
    if (!fileArchival) throw new NotFoundException('Không tìm thấy file');

    if (dto.fileName) fileArchival.fileName = dto.fileName;
    if (dto.fileUrl) fileArchival.fileUrl = dto.fileUrl;
    if (dto.fileType) fileArchival.fileType = dto.fileType;
    if (dto.fileSizeBytes !== undefined)
      fileArchival.fileSizeBytes = dto.fileSizeBytes;
    if (dto.extension) fileArchival.extension = dto.extension;
    if (dto.mimeType) fileArchival.mimeType = dto.mimeType;
    if (dto.moduleType) fileArchival.moduleType = dto.moduleType;
    if (dto.storageProvider) fileArchival.storageProvider = dto.storageProvider;
    if (dto.storagePath) fileArchival.storagePath = dto.storagePath;
    if (dto.uploadedBy) fileArchival.uploadedBy = dto.uploadedBy;
    fileArchival.updatedAt = new Date();
    fileArchival.updatedBy = 'system';

    await this.repo.save(fileArchival);
    return { message: 'Cập nhật thành công', data: fileArchival };
  }

  async remove(id: string): Promise<void> {
    const fileArchival = await this.repo.findOne({ where: { id } });
    if (!fileArchival) throw new NotFoundException('Không tìm thấy file');

    await this.repo.delete({ id });
  }

  async removeByFk(fkField: string, fkValue: string): Promise<void> {
    await this.repo.delete({ [fkField]: fkValue });
  }
}
