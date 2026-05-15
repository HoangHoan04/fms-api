import { FileArchivalEntity } from '@/entities';
import { FileArchivalRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateFileArchivalDto,
  CreateManyFileArchivalDto,
  FilterFileArchivalDto,
  UpdateFileArchivalDto,
} from './dto';

@Injectable()
export class FileArchivalService {
  constructor(private readonly repo: FileArchivalRepository) {}

  async create(dto: CreateFileArchivalDto): Promise<FileArchivalEntity> {
    const entity = this.buildEntity(dto);
    return await this.repo.save(entity);
  }

  async createMany(
    dto: CreateManyFileArchivalDto,
  ): Promise<FileArchivalEntity[]> {
    const entities = dto.files.map((f) => this.buildEntity(f));
    return await this.repo.save(entities);
  }

  async findById(id: string): Promise<FileArchivalEntity> {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) throw new NotFoundException('Không tìm thấy file');
    return result;
  }

  async pagination(dto: {
    where?: FilterFileArchivalDto;
    skip: number;
    take: number;
  }) {
    const whereCon: FindOptionsWhere<FileArchivalEntity> = {};

    if (dto.where?.fileName)
      whereCon.fileName = ILike(`%${dto.where.fileName}%`);
    if (dto.where?.fileType)
      whereCon.fileType = ILike(`%${dto.where.fileType}%`);
    if (dto.where?.moduleType)
      whereCon.moduleType = ILike(`%${dto.where.moduleType}%`);
    if (dto.where?.relatedId) whereCon.relatedId = dto.where.relatedId;
    if (dto.where?.isDeleted !== undefined)
      whereCon.isDeleted = dto.where.isDeleted;

    const [data, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: dto.skip,
      take: dto.take,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async update(dto: UpdateFileArchivalDto): Promise<FileArchivalEntity> {
    const existing = await this.findById(dto.id);

    const updated = this.repo.merge(existing, {
      fileName: dto.fileName,
      fileUrl: dto.fileUrl,
      fileType: dto.fileType,
      fileSizeBytes: dto.fileSizeBytes,
      extension: dto.extension,
      mimeType: dto.mimeType,
      relatedId: dto.relatedId,
      moduleType: dto.moduleType,
      storageProvider: dto.storageProvider,
      storagePath: dto.storagePath,
      checksum: dto.checksum,
      uploadedBy: dto.uploadedBy,
      description: dto.description,
      memberId: dto.memberId,
      employeeId: dto.employeeId,
      qrCodeId: dto.qrCodeId,
      updatedBy: dto.createdBy,
      updatedAt: new Date(),
    });

    return await this.repo.save(updated);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findById(id);
    await this.repo.remove(entity);
  }

  async removeByFk(fkField: string, fkValue: string): Promise<void> {
    await this.repo.delete({ [fkField]: fkValue });
  }

  private buildEntity(dto: CreateFileArchivalDto): FileArchivalEntity {
    const entity = new FileArchivalEntity();
    entity.id = uuidv4();
    entity.fileName = dto.fileName;
    entity.fileUrl = dto.fileUrl;
    entity.fileType = dto.fileType;
    entity.fileSizeBytes = dto.fileSizeBytes;
    entity.extension = dto.extension;
    entity.mimeType = dto.mimeType;
    entity.relatedId = dto.relatedId;
    entity.moduleType = dto.moduleType;
    entity.storageProvider = dto.storageProvider;
    entity.storagePath = dto.storagePath;
    entity.checksum = dto.checksum;
    entity.uploadedBy = dto.uploadedBy;
    entity.description = dto.description;
    entity.memberId = dto.memberId;
    entity.employeeId = dto.employeeId;
    entity.qrCodeId = dto.qrCodeId;
    entity.createdBy = dto.createdBy;
    entity.createdAt = new Date();
    return entity;
  }
}
