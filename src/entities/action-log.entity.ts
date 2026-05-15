import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

/** Ghi lại mọi hành động quan trọng trong hệ thống để audit */
@Entity('action-logs')
@Index('IDX_Function', ['entityName', 'entityId'])
export class ActionLogEntity extends BaseEntity {
  /** ID người thực hiện thao tác */
  @Column({ type: 'varchar', length: 250, nullable: false })
  createdById: string;

  /** Mã người thực hiện */
  @Column({ type: 'varchar', length: 250, nullable: false })
  createdByCode: string;

  /** Tên người thực hiện */
  @Column({ type: 'varchar', length: 250, nullable: false })
  createdByName: string;

  /** Thông tin bổ sung về người thực hiện */
  @Column({ type: 'varchar', length: 500, nullable: true })
  createdNote?: string;

  /** Loại hành động: CREATE | UPDATE | DELETE | LOGIN | APPROVE | ... */
  @Column({ type: 'varchar', length: 100 })
  actionType: string;

  /** Tên bảng/đối tượng bị tác động, VD: Contributions */
  @Index()
  @Column({ type: 'varchar', length: 50 })
  entityName: string;

  /** UUID của bản ghi bị tác động */
  @Column({ type: 'uuid' })
  entityId: string;

  /** Giá trị trước thay đổi (JSON string) */
  @Column({ type: 'text', nullable: true })
  oldValue?: string;

  /** Giá trị sau thay đổi (JSON string) */
  @Column({ type: 'text', nullable: true })
  newValue?: string;

  /** Địa chỉ IP của người dùng */
  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress?: string;

  /** Thông tin trình duyệt / thiết bị */
  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent?: string;

  /** Mô tả hành động (legacy) */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /** Dữ liệu trước khi thay đổi (legacy JSON) */
  @Column({ type: 'json', nullable: true })
  dataOld?: Record<string, any>;

  /** Dữ liệu sau khi thay đổi (legacy JSON) */
  @Column({ type: 'json', nullable: true })
  dataNew?: Record<string, any>;

  /** Loại thao tác (legacy) */
  @Column({ type: 'varchar', length: 36, nullable: true })
  type?: string;

  /** Tên entity bị tác động (legacy) */
  @Column({ type: 'varchar', length: 250, nullable: true })
  functionType?: string;

  /** ID của entity bị tác động (legacy) */
  @Column({ type: 'varchar', length: 36, nullable: true })
  functionId?: string;
}
