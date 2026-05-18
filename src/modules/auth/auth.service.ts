import { UserDto } from '@/dto';
import { UserEntity } from '@/entities/users';
import {
  LoginLogRepository,
  MemberRepository,
  UserRepository,
} from '@/repositories';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FileArchivalService } from '../file-archival/file-archival.service';
import { NotifyService } from '../notify/notify.service';
import {
  CheckPhoneAndEmailDto,
  ForgotPasswordMemberDto,
  RefreshTokenDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
    private readonly memberRepo: MemberRepository,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly fileArchivalService: FileArchivalService,
    // private readonly emailService: EmailService,
    private readonly notifyService: NotifyService,
    private readonly loginLogRepo: LoginLogRepository,
  ) {}

  private determineActorType(user: UserEntity): string {
    if (user.isAdmin) return 'admin';
    if (user.memberId) return 'member';
    return 'unknown';
  }

  private async createLoginLog() {}

  private async computeUserPermissions(userId: string) {}

  private genCodeUser() {}

  /** Đăng nhập */
  async login() {}

  /** Cấp mới access token bằng refresh token */
  async refreshToken(data: RefreshTokenDto) {}

  /** Đăng xuất (hủy refresh token) */
  async updatePassword() {}

  /** Thay đổi mật khẩu */
  async changePassword() {}

  /** Lấy thông tin người dùng hiện tại */
  async getUserInfo(user: UserDto) {}

  /** Đăng xuất (hủy refresh token) */
  async logout(user: UserDto) {}

  /** Kiểm tra email hoặc số điện thoại đã tồn tại chưa */
  async checkPhoneAndEmail(data: CheckPhoneAndEmailDto) {}

  /** Quên mật khẩu */
  async forgotPassword(data: ForgotPasswordMemberDto) {}
}
