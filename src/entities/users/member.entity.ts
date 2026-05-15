import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserEntity } from '.';
import { FileArchivalEntity } from '..';
import { BaseEntity } from '../base.entity';

/** Hồ sơ thành viên tham gia quỹ nhóm */
@Entity('members')
export class MemberEntity extends BaseEntity {
  /** Liên kết tài khoản đăng nhập (1-1, có thể null nếu nhập tay) */
  @Column({ type: 'uuid', nullable: true })
  userId: string;
  @OneToOne(() => UserEntity, (user) => user.member)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  /** Mã thành viên, VD: MBR-0001 */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  code: string;

  /** Họ tên đầy đủ */
  @Column({ type: 'varchar', length: 100, nullable: true })
  fullName: string;

  /** Tên gọi ngắn / biệt danh */
  @Column({ type: 'varchar', length: 100, nullable: true })
  shortName?: string;

  /** Email liên hệ */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email: string;

  /** Số điện thoại */
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  /** Giới tính: Male | Female | Other */
  @Column({ type: 'varchar', length: 20, nullable: true })
  gender?: string;

  /** Ngày sinh */
  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  /** Tên ngân hàng (VD: Vietcombank, MB Bank) */
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankName?: string;

  /** Số tài khoản ngân hàng */
  @Column({ type: 'varchar', length: 50, nullable: true })
  bankAccountNo?: string;

  /** Tên chủ tài khoản (phải khớp với ngân hàng) */
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankAccountName?: string;

  /** Ảnh QR code ngân hàng để nhận chuyển khoản */
  @Column({ type: 'uuid', nullable: true })
  qrCodeFileId?: string;
  @ManyToOne(() => FileArchivalEntity)
  @JoinColumn({ name: 'qrCodeFileId' })
  qrCodeFile?: FileArchivalEntity;

  /** Ảnh đại diện thành viên */
  @Column({ type: 'uuid', nullable: true })
  avatarFileId?: string;
  @ManyToOne(() => FileArchivalEntity)
  @JoinColumn({ name: 'avatarFileId' })
  avatarFile?: FileArchivalEntity;

  /** Ghi chú thêm về thành viên */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /** Trạng thái: active | inactive | suspended */
  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  /** Ảnh đại diện (legacy relation) */
  @OneToMany(() => FileArchivalEntity, (p) => p.member)
  avatar: Promise<FileArchivalEntity[]>;
}
