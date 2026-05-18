import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './users/user.entity';

@Entity('system-configs')
export class SystemConfigEntity extends BaseEntity {
  @ApiProperty({ description: 'Khóa cấu hình duy nhất' })
  @Column({ type: 'varchar', length: 100, unique: true })
  key: string;

  @ApiProperty({ description: 'Giá trị cấu hình' })
  @Column({ type: 'text' })
  value: string;

  @ApiProperty({
    description: 'Kiểu dữ liệu: string | number | boolean | json',
  })
  @Column({ type: 'varchar', length: 20, default: 'string' })
  dataType: string;

  @ApiProperty({ description: 'Mô tả cấu hình' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Nhóm: fund | notification | payment | birthday | security',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  category?: string;

  @ApiProperty({ description: 'Có thể frontend đọc không' })
  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @ApiProperty({ description: 'Admin thay đổi gần nhất' })
  @Column({ type: 'uuid', nullable: true })
  lastChangedBy?: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'lastChangedBy' })
  lastChanger?: UserEntity;
}
