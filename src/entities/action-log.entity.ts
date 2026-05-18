import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './users/user.entity';

@Entity('action-logs')
export class ActionLogEntity extends BaseEntity {
  @ApiProperty({ description: 'ID người thực hiện thao tác' })
  @Column({ type: 'uuid' })
  userId: string;
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiProperty({
    description:
      'Loại hành động: CREATE | UPDATE | DELETE | LOGIN | APPROVE | ...',
  })
  @Column({ type: 'varchar', length: 100 })
  actionType: string;

  @ApiProperty({ description: 'Tên bảng/đối tượng bị tác động' })
  @Index()
  @Column({ type: 'varchar', length: 50 })
  entityName: string;

  @ApiProperty({ description: 'UUID của bản ghi bị tác động' })
  @Column({ type: 'uuid' })
  entityId: string;

  @ApiProperty({ description: 'Giá trị trước thay đổi (JSON string)' })
  @Column({ type: 'text', nullable: true })
  oldValue?: string;

  @ApiProperty({ description: 'Giá trị sau thay đổi (JSON string)' })
  @Column({ type: 'text', nullable: true })
  newValue?: string;

  @ApiProperty({ description: 'Địa chỉ IP của người dùng' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress?: string;

  @ApiProperty({ description: 'Thông tin trình duyệt / thiết bị' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent?: string;

  @ApiProperty({ description: 'Mô tả hành động bằng ngôn ngữ tự nhiên' })
  @Column({ type: 'text', nullable: true })
  description?: string;
}
