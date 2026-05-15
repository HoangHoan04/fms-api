import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { enumData } from '@/common/contanst/enumData';

@Entity('system-configs')
export class SystemConfigEntity extends BaseEntity {
  /** Mã cấu hình */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Mã cấu hình',
  })
  code: string;

  /** Tên cấu hình */
  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
    comment: 'Tên cấu hình',
  })
  name: string;

  /** Ghi chú */
  @Column({ type: 'text', nullable: true, comment: 'Ghi chú' })
  note: string;

  /** loại dữ liệu */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: enumData.DataType.string.code,
    comment: 'loại dữ liệu',
  })
  type: string;

  /** Thiết lập dành cho */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    default: enumData.SettingTab.SYSTEM.code,
    comment: 'Thiết lập dành cho',
  })
  settingTab: string;

  @ApiProperty({ description: 'Khóa cấu hình (unique)' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  key: string;

  @ApiProperty({ description: 'Giá trị cấu hình' })
  @Column({ type: 'text', nullable: true })
  value?: string;

  @ApiProperty({ description: 'Mô tả cấu hình' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Nhóm cấu hình',
    enum: ['Arena', 'Exam', 'AI', 'Payment', 'General'],
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  category?: string;
}
