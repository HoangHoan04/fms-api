import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

/** Ghi lại mọi hành động quan trọng trong hệ thống để audit */
@Entity('action-logs')
@Index('IDX_Function', ['entityName', 'entityId'])
export class ActionLogEntity extends BaseEntity {
  /** ID người thực hiện thao tác */
  @ApiProperty({ description: 'ID người thực hiện thao tác' })
  @Column({ type: 'varchar', length: 250, nullable: false })
  createdById: string;

  /** Mã người thực hiện */
  @ApiProperty({ description: 'Mã người thực hiện thao tác' })
  @Column({ type: 'varchar', length: 250, nullable: false })
  createdByCode: string;

  /** Tên người thực hiện */
  @ApiProperty({ description: 'Tên người thực hiện thao tác' })
  @Column({ type: 'varchar', length: 250, nullable: false })
  createdByName: string;

  /** Thông tin bổ sung về người thực hiện */
  @ApiProperty({ description: 'Thông tin bổ sung về người thực hiện thao tác' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  createdNote?: string;

  /** Loại hành động: CREATE | UPDATE | DELETE | LOGIN | APPROVE | ... */
  @ApiProperty({ description: 'Loại hành động' })
  @Column({ type: 'varchar', length: 100 })
  actionType: string;

  /** Tên bảng/đối tượng bị tác động, VD: Contributions */
  @Index()
  @ApiProperty({ description: 'Tên bảng hoặc đối tượng bị tác động' })
  @Column({ type: 'varchar', length: 50 })
  entityName: string;

  /** UUID của bản ghi bị tác động */
  @ApiProperty({ description: 'ID của bản ghi bị tác động' })
  @Column({ type: 'uuid' })
  entityId: string;

  /** Giá trị trước thay đổi (JSON string) */
  @ApiProperty({ description: 'Giá trị trước thay đổi (JSON string)' })
  @Column({ type: 'text', nullable: true })
  oldValue?: string;

  /** Giá trị sau thay đổi (JSON string) */
  @ApiProperty({ description: 'Giá trị sau thay đổi (JSON string)' })
  @Column({ type: 'text', nullable: true })
  newValue?: string;

  /** Địa chỉ IP của người dùng */
  @ApiProperty({ description: 'Địa chỉ IP của người thực hiện thao tác' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress?: string;

  /** Thông tin trình duyệt / thiết bị */
  @ApiProperty({
    description:
      'Thông tin trình duyệt hoặc thiết bị của người thực hiện thao tác',
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent?: string;
}
