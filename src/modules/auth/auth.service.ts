import { enumData } from '@/common/contanst/enumData';
import { UserDto } from '@/dto';
import { LoginLogEntity } from '@/entities';
import { MemberEntity, UserEntity } from '@/entities/users';
import {
  LoginLogRepository,
  MemberRepository,
  RolePermissionRepository,
  UserPermissionRepository,
  UserRepository,
} from '@/repositories';
import { OtpService } from '@/services/otp.service';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';
import { lastValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../email/email.service';
import { FileArchivalService } from '../file-archival/file-archival.service';
import { NotifyService } from '../notify/notify.service';
import {
  ChangePasswordDto,
  CheckPhoneAndEmailDto,
  FacebookLoginDto,
  ForgotPasswordMemberDto,
  GoogleLoginDto,
  RefreshTokenDto,
  RegisterDto,
  SendOtpMemberDto,
  SendOtpVerifyDto,
  UpdatePasswordDto,
  UserLoginDto,
  VerifyLoginOtpDto,
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
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly notifyService: NotifyService,
    private readonly userPermissionRepo: UserPermissionRepository,
    private readonly rolePermissionRepo: RolePermissionRepository,
    private readonly loginLogRepo: LoginLogRepository,
  ) {}

  private determineActorType(user: UserEntity): string {
    if (user.isAdmin) return 'admin';
    if (user.memberId) return 'member';
    if (user.employeeId) return 'employee';
    return 'unknown';
  }

  private async createLoginLog(params: {
    userId: string;
    actorType: string;
    actorId?: string;
    loginProvider?: string;
    status: 'success' | 'failed';
    failReason?: string;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
  }): Promise<void> {
    try {
      const log = new LoginLogEntity();
      log.id = uuidv4();
      log.userId = params.userId;
      log.actorType = params.actorType;
      log.actorId = params.actorId;
      log.loginProvider = params.loginProvider;
      log.status = params.status;
      log.failReason = params.failReason;
      log.ipAddress = params.ipAddress;
      log.userAgent = params.userAgent;
      log.sessionId = params.sessionId;
      log.loggedInAt = params.status === 'success' ? new Date() : undefined;
      log.createdAt = new Date();
      log.createdBy = params.userId;
      await this.loginLogRepo.save(log);
    } catch (error) {
      console.error('Failed to save login log:', error);
    }
  }

  private async computeUserPermissions(userId: string): Promise<string[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: {
        userRoles: {
          role: {
            rolePermissions: {
              permission: true,
            },
          },
        },
        userPermissions: {
          permission: true,
        },
      },
    });

    if (!user) return [];

    const rolePermissionCodes = new Set<string>();
    for (const ur of user.userRoles || []) {
      if (ur.role?.isActive !== false) {
        for (const rp of ur.role.rolePermissions || []) {
          if (rp.permission?.code && !rp.isDeleted) {
            rolePermissionCodes.add(rp.permission.code);
          }
        }
      }
    }

    const userAllowPermissions = new Set<string>();
    const userDenyPermissions = new Set<string>();
    for (const up of user.userPermissions || []) {
      if (up.permission?.code && !up.isDeleted) {
        const isExpired = up.expiresAt && new Date(up.expiresAt) < new Date();
        if (!isExpired) {
          if (up.grantType === 'Deny') {
            userDenyPermissions.add(up.permission.code);
          } else {
            userAllowPermissions.add(up.permission.code);
          }
        }
      }
    }

    return [...rolePermissionCodes, ...userAllowPermissions].filter(
      (p) => !userDenyPermissions.has(p),
    );
  }

  private genCodeUser() {
    const generate = customAlphabet('0123456789', 5);
    return `USER-${generate()}`;
  }

  /** Đăng nhập */
  async login(
    data: UserLoginDto,
    context?: { ipAddress?: string; userAgent?: string },
  ) {
    const user = await this.userRepo.findOne({
      where: [
        { username: data.username, isDeleted: false },
        { email: data.username, isDeleted: false },
      ],
      relations: {
        member: true,
        employee: true,
        userRoles: { role: true },
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Không tìm thấy người dùng với thông tin đăng nhập này',
      );
    }

    if (!user.isActive) {
      await this.createLoginLog({
        userId: user.id,
        actorType: this.determineActorType(user),
        actorId: user.memberId || user.employeeId,
        loginProvider: 'local',
        status: 'failed',
        failReason: 'account_disabled',
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
      });
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      await this.createLoginLog({
        userId: user.id,
        actorType: this.determineActorType(user),
        actorId: user.memberId || user.employeeId,
        loginProvider: 'local',
        status: 'failed',
        failReason: 'wrong_password',
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
      });
      throw new UnauthorizedException('Mật khẩu không đúng! Vui lòng thử lại');
    }

    const payload = { uid: user.id };
    const accessToken = this.jwtService.sign(payload);

    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret';
    const refreshExpiry =
      this.configService.get<string>('JWT_REFRESH_EXPIRY') || '7d';

    const refreshTokenPayload = { uid: user.id, isRefreshToken: true };
    const refreshToken = jwt.sign(refreshTokenPayload, refreshSecret, {
      expiresIn: refreshExpiry,
    } as jwt.SignOptions);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(user.id, {
      refreshToken: hashedRefreshToken,
      lastLoginAt: new Date(),
    });

    if (user.isAdmin) {
      await this.notifyService.createNotifyAdmin({
        title: 'Đăng nhập thành công',
        titleEn: 'Login Successful',
        description: `Admin "${user.username}" đã đăng nhập lúc ${new Date().toLocaleString('vi-VN')}`,
        descriptionEn: `Admin "${user.username}" logged in at ${new Date().toLocaleString('en-US')}`,
        category: 'AUTH',
        colorType: 'blue',
        callbackUrl: undefined,
        notifyPermissionType: '',
      });
    }

    await this.createLoginLog({
      userId: user.id,
      actorType: this.determineActorType(user),
      actorId: user.memberId || user.employeeId,
      loginProvider: 'local',
      status: 'success',
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
      sessionId: accessToken,
    });

    const permissions = await this.computeUserPermissions(user.id);

    const userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      lastLogin: new Date(),
      member: user.member,
      employee: user.employee,
      roles: user.userRoles?.map((ur) => ur.role),
      permissions,
    };

    return {
      user: userInfo,
      accessToken,
      refreshToken,
      message: 'Đăng nhập thành công',
    };
  }

  /** Đăng nhập với Google */
  async loginWithGoogle(
    data: GoogleLoginDto,
    context?: { ipAddress?: string; userAgent?: string },
  ) {
    try {
      const googleUser = await this.verifyGoogleIdToken(data.idToken);

      if (!googleUser.sub) {
        throw new BadRequestException('Token Google không hợp lệ');
      }
      let user = await this.userRepo.findOne({
        where: { googleId: googleUser.sub },
        relations: { member: true, employee: true },
      });
      if (!user && googleUser.email) {
        const existingUser = await this.userRepo.findOne({
          where: { email: googleUser.email },
          relations: { member: true, employee: true },
        });
        if (existingUser) {
          await this.userRepo.update(existingUser.id, {
            googleId: googleUser.sub,
            loginProvider:
              existingUser.loginProvider || enumData.LoginProvider.GOOGLE,
            isVerified: true,
          });

          if (existingUser.memberId && googleUser.picture) {
            await this.fileArchivalService.create({
              fileUrl: googleUser.picture,
              fileName: `google_avatar_${googleUser.sub}`,
              fileType: 'MEMBER_AVATAR',
              memberId: existingUser.memberId,
              createdBy: 'google-oauth',
            });
          }

          user = await this.userRepo.findOne({
            where: { id: existingUser.id },
            relations: { member: true, employee: true },
          });
        }
      }

      if (!user) {
        const member = new MemberEntity();
        member.id = uuidv4();
        member.code = `GOOGLE_${googleUser.sub.substring(0, 10)}`;
        member.fullName = googleUser.name || 'Người dùng Google';
        member.email =
          googleUser.email || `google_${googleUser.sub}@temporary.com`;
        member.phone = 'N/A';
        member.gender = enumData.Gender.OTHER.code;
        member.birthday = new Date('2000-01-01');
        member.createdAt = new Date();
        member.createdBy = 'google-oauth';

        await this.memberRepo.insert(member);

        if (googleUser.picture) {
          await this.fileArchivalService.create({
            fileUrl: googleUser.picture,
            fileName: `google_avatar_${googleUser.sub}`,
            fileType: 'MEMBER_AVATAR',
            memberId: member.id,
            createdBy: 'google-oauth',
          });
        }

        user = new UserEntity();
        user.id = uuidv4();
        user.code = this.genCodeUser();
        user.username = member.phone;
        user.email = googleUser.email || `${member.code}@google.com`;
        user.password = member.email;
        user.isActive = true;
        user.isAdmin = false;
        user.memberId = member.id;
        user.employeeId = undefined;
        user.refreshToken = '';
        user.googleId = googleUser.sub;
        user.loginProvider = enumData.LoginProvider.GOOGLE;
        user.isVerified = true;
        user.createdAt = new Date();
        user.createdBy = 'google-oauth';

        await this.userRepo.insert(user);
      } else {
        if (!user.isActive) {
          await this.createLoginLog({
            userId: user.id,
            actorType: this.determineActorType(user),
            actorId: user.memberId || user.employeeId,
            loginProvider: 'google',
            status: 'failed',
            failReason: 'account_disabled',
            ipAddress: context?.ipAddress,
            userAgent: context?.userAgent,
          });
          throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
        }
      }

      const payload = { uid: user.id };
      const accessToken = this.jwtService.sign(payload);

      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'refresh-secret';
      const refreshExpiry =
        this.configService.get<string>('JWT_REFRESH_EXPIRY') || '7d';

      const refreshTokenPayload = { uid: user.id, isRefreshToken: true };
      const refreshToken = jwt.sign(refreshTokenPayload, refreshSecret, {
        expiresIn: refreshExpiry,
      } as jwt.SignOptions);

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.userRepo.update(user.id, {
        refreshToken: hashedRefreshToken,
        lastLoginAt: new Date(),
      });

      await this.createLoginLog({
        userId: user.id,
        actorType: this.determineActorType(user),
        actorId: user.memberId || user.employeeId,
        loginProvider: 'google',
        status: 'success',
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
        sessionId: accessToken,
      });

      const fullUser = await this.userRepo.findOne({
        where: { id: user.id },
        relations: {
          member: true,
          userRoles: {
            role: true,
          },
        },
      });

      if (!fullUser) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      const userInfo = {
        id: fullUser.id,
        code: fullUser.code,
        username: fullUser.username,
        email: fullUser.email,
        isAdmin: fullUser.isAdmin,
        isActive: fullUser.isActive,
        lastLogin: new Date(),
        member: fullUser.member,
        roles: fullUser.userRoles?.map((ur) => ur.role),
      };

      return {
        user: userInfo,
        accessToken,
        refreshToken,
        message: 'Đăng nhập bằng Google thành công',
      };
    } catch (error: any) {
      console.error('Login Google Error:', error);
      throw new BadRequestException(
        error.message || 'Đăng nhập bằng Google thất bại',
      );
    }
  }

  /** Xác thực token ID của Google và lấy thông tin người dùng */
  private async verifyGoogleIdToken(token: string) {
    try {
      const url = `https://www.googleapis.com/oauth2/v3/userinfo`;

      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      const tokenInfo = response.data;
      if (tokenInfo.email_verified === false) {
        throw new BadRequestException('Email Google chưa được xác thực');
      }

      return {
        sub: tokenInfo.sub,
        email: tokenInfo.email,
        name: tokenInfo.name,
        picture: tokenInfo.picture,
      };
    } catch (error: any) {
      console.error(
        'Error verifying Google token:',
        error?.response?.data || error.message,
      );
      throw new BadRequestException(
        'Token Google không hợp lệ hoặc đã hết hạn',
      );
    }
  }

  /** Đăng nhập với Facebook */
  async loginWithFacebook(
    data: FacebookLoginDto,
    context?: { ipAddress?: string; userAgent?: string },
  ) {
    try {
      const fbUser = await this.getFacebookUserInfo(data.accessToken);
      if (!fbUser.id) {
        throw new BadRequestException('Token Facebook không hợp lệ');
      }
      let user = await this.userRepo.findOne({
        where: { facebookId: fbUser.id },
        relations: { member: true },
      });

      if (!user) {
        if (fbUser.email) {
          const existingUser = await this.userRepo.findOne({
            where: { email: fbUser.email },
            relations: { member: true },
          });

          if (existingUser) {
            await this.userRepo.update(existingUser.id, {
              facebookId: fbUser.id,
              isVerified: true,
            });

            user = await this.userRepo.findOne({
              where: { id: existingUser.id },
              relations: { member: true },
            });
          }
        }

        if (!user) {
          const member = new MemberEntity();
          member.id = uuidv4();
          member.code = `FB_${fbUser.id.substring(0, 20)}`;
          member.fullName = fbUser.name || 'Người dùng Facebook';
          member.email = fbUser.email || `fb_${fbUser.id}@temporary.com`;
          member.phone = fbUser.phone || 'N/A';
          member.gender = enumData.Gender.OTHER.code;
          member.birthday = new Date('2000-01-01');
          member.createdAt = new Date();
          member.createdBy = 'facebook-oauth';

          await this.memberRepo.insert(member);

          if (fbUser.picture?.data?.url) {
            await this.fileArchivalService.create({
              fileUrl: fbUser.picture.data.url,
              fileName: `facebook_avatar_${fbUser.id}`,
              fileType: 'MEMBER_AVATAR',
              memberId: member.id,
              createdBy: 'facebook-oauth',
            });
          }

          user = new UserEntity();
          user.id = uuidv4();
          user.code = this.genCodeUser();
          user.username = member.phone;
          user.email = fbUser.email || `${member.phone}@facebook.user`;
          user.password = uuidv4();
          user.isActive = true;
          user.isAdmin = false;
          user.memberId = member.id;
          user.employeeId = undefined;
          user.refreshToken = '';
          user.facebookId = fbUser.id;
          user.loginProvider = enumData.LoginProvider.FACEBOOK;
          user.isVerified = true;
          user.createdAt = new Date();
          user.createdBy = 'facebook-oauth';

          await this.userRepo.insert(user);
        }
      } else {
        if (!user.isActive) {
          await this.createLoginLog({
            userId: user.id,
            actorType: this.determineActorType(user),
            actorId: user.memberId || user.employeeId,
            loginProvider: 'facebook',
            status: 'failed',
            failReason: 'account_disabled',
            ipAddress: context?.ipAddress,
            userAgent: context?.userAgent,
          });
          throw new UnauthorizedException('Tài khoản bị vô hiệu hóa');
        }
      }

      const payload = { uid: user.id };
      const accessToken = this.jwtService.sign(payload);

      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'refresh-secret';
      const refreshExpiry =
        this.configService.get<string>('JWT_REFRESH_EXPIRY') || '7d';

      const refreshTokenPayload = { uid: user.id, isRefreshToken: true };
      const refreshToken = jwt.sign(refreshTokenPayload, refreshSecret, {
        expiresIn: refreshExpiry,
      } as jwt.SignOptions);

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.userRepo.update(user.id, {
        refreshToken: hashedRefreshToken,
        lastLoginAt: new Date(),
      });

      await this.createLoginLog({
        userId: user.id,
        actorType: this.determineActorType(user),
        actorId: user.memberId || user.employeeId,
        loginProvider: 'facebook',
        status: 'success',
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
        sessionId: accessToken,
      });

      const fullUser = await this.userRepo.findOne({
        where: { id: user.id },
        relations: {
          member: true,
          userRoles: {
            role: true,
          },
        },
      });

      if (!fullUser) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      const userInfo = {
        id: fullUser.id,
        code: fullUser.code,
        username: fullUser.username,
        email: fullUser.email,
        isAdmin: fullUser.isAdmin,
        isActive: fullUser.isActive,
        lastLogin: new Date(),
        member: fullUser.member,
        roles: fullUser.userRoles?.map((ur) => ur.role),
      };

      return {
        user: userInfo,
        accessToken,
        refreshToken,
        message: 'Đăng nhập bằng Facebook thành công',
      };
    } catch (error: any) {
      throw new BadRequestException(
        error.message || 'Đăng nhập Facebook thất bại',
      );
    }
  }

  /** Lấy thông tin người dùng từ Facebook bằng access token */
  private async getFacebookUserInfo(accessToken: string) {
    try {
      const url = `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`;
      const response = await lastValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error: any) {
      console.error(
        'Error verifying Facebook token:',
        error?.response?.data || error.message,
      );
      throw new BadRequestException('Token Facebook không hợp lệ hoặc hết hạn');
    }
  }

  async refreshToken(data: RefreshTokenDto) {
    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'refresh-secret';
      const payload = jwt.verify(data.refreshToken, refreshSecret) as any;

      if (!payload.isRefreshToken) {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      const user = await this.userRepo.findOne({
        where: { id: payload.uid, isDeleted: false },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException(
          'Người dùng không tồn tại hoặc đã bị vô hiệu hóa',
        );
      }

      if (!user.refreshToken) {
        throw new UnauthorizedException('Refresh token không tồn tại');
      }

      const isRefreshTokenValid = await bcrypt.compare(
        data.refreshToken,
        user.refreshToken,
      );
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      const newPayload = { uid: user.id };
      const newAccessToken = this.jwtService.sign(newPayload);

      return {
        accessToken: newAccessToken,
        message: 'Làm mới token thành công',
      };
    } catch {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }
  }

  async updatePassword(
    { currentPassword, newPassword }: UpdatePasswordDto,
    user: UserDto,
  ) {
    const currentUser = await this.userRepo.findOne({
      where: { id: user.id, isDeleted: false },
    });

    if (!currentUser) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      currentUser.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepo.update(user.id, {
      password: hashedNewPassword,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    return {
      message: 'Cập nhật mật khẩu thành công',
    };
  }

  async changePassword(
    { currentPassword, newPassword, confirmPassword }: ChangePasswordDto,
    user: UserDto,
  ) {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'Mật khẩu mới và xác nhận mật khẩu không khớp',
      );
    }

    return this.updatePassword({ currentPassword, newPassword }, user);
  }

  async getUserInfo(user: UserDto) {
    const currentUser = await this.userRepo.findOne({
      where: { id: user.id, isDeleted: false },
      relations: {
        member: {
          avatar: true,
        },
        userRoles: {
          role: true,
        },
      },
    });

    if (!currentUser) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const permissions = await this.computeUserPermissions(currentUser.id);

    const avatarList = await currentUser.member?.avatar;

    const avatarArray =
      avatarList && avatarList.length > 0
        ? avatarList.map((avatar) => ({
            fileName: avatar.fileName,
            fileUrl: avatar.fileUrl,
          }))
        : [];

    const data = {
      id: currentUser.id,
      code: currentUser.code,
      username: currentUser.username,
      email: currentUser.email,
      isAdmin: currentUser.isAdmin,
      isActive: currentUser.isActive,
      isVerified: currentUser.isVerified,
      lastLoginAt: currentUser.lastLoginAt,
      memberId: currentUser.memberId,
      employeeId: currentUser.employeeId,
      loginProvider: currentUser.loginProvider,
      member: currentUser.member,
      roles: currentUser.userRoles?.map((ur) => ur.role),
      permissions,
      avatar: avatarArray,
    };

    return {
      user: data,
      message: 'Lấy thông tin người dùng thành công',
    };
  }

  async logout(user: UserDto) {
    await this.userRepo.update(user.id, {
      refreshToken: undefined,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    return {
      message: 'Đăng xuất thành công',
    };
  }

  async checkPhoneAndEmail(data: CheckPhoneAndEmailDto) {
    const isEmail = data?.email?.includes('@');
    const user = await this.userRepo.findOne({
      where: isEmail ? { email: data.email } : { username: data.phone },
    });
    return { exists: !!user, message: user ? 'Đã tồn tại' : 'Chưa tồn tại' };
  }

  async sendOtpMember(data: SendOtpMemberDto) {
    const identifier = data.sendMethod === 'EMAIL' ? data.email : data.phone;
    if (!identifier)
      throw new BadRequestException(
        'Vui lòng cung cấp email hoặc số điện thoại',
      );

    const isEmail = data.sendMethod === 'EMAIL';
    const user = await this.userRepo.findOne({
      where: isEmail ? { email: identifier } : { username: identifier },
      withDeleted: true,
    });
    if (user) {
      throw new BadRequestException(
        'Tài khoản đã tồn tại. Vui lòng đăng nhập.',
      );
    }

    const otpCode = await this.otpService.createOtp(
      identifier,
      data.sendMethod,
    );
    if (data.sendMethod === 'EMAIL') {
      await this.emailService.sendEmailVerify({ email: identifier, otpCode });
    }
    return { message: 'Gửi mã OTP thành công' };
  }

  async sendOtpVerify(data: SendOtpVerifyDto) {
    const isEmail = data.method === 'EMAIL';
    const user = await this.userRepo.findOne({
      where: isEmail
        ? { email: data.identifier }
        : { username: data.identifier },
    });
    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại trong hệ thống');
    }

    const otpCode = await this.otpService.createOtp(
      data.identifier,
      data.method,
    );
    if (data.method === 'EMAIL') {
      await this.emailService.sendEmailForgotPassword({
        email: data.identifier,
        otpCode,
      });
    }
    return { message: 'Gửi mã xác nhận thành công' };
  }

  async register(data: RegisterDto) {
    const identifier = data.sendMethod === 'EMAIL' ? data.email : data.phone;

    // 1. Verify OTP
    await this.otpService.verifyOtp(identifier, data.otpCode, data.sendMethod);

    // 2. Check exist again
    const existUser = await this.userRepo.findOne({
      where: [{ email: data.email }, { username: data.phone }],
      withDeleted: true,
    });
    if (existUser)
      throw new BadRequestException('Email hoặc số điện thoại đã được đăng ký');

    // 3. Create Member
    const member = new MemberEntity();
    member.id = uuidv4();
    member.fullName = data.name;
    member.email = data.email;
    member.phone = data.phone;
    member.gender = data.gender || enumData.Gender.OTHER.code;
    member.code = `STD_${Math.floor(100000 + Math.random() * 900000)}`;
    member.birthday = new Date('2000-01-01');
    member.createdAt = new Date();
    member.createdBy = 'system';

    await this.memberRepo.insert(member);

    // 4. Create User (@BeforeInsert sẽ tự hash password)
    const user = new UserEntity();
    user.id = uuidv4();
    user.code = this.genCodeUser();
    user.username = data.phone || data.email;
    user.email = data.email;
    user.password = data.password;
    user.isActive = true;
    user.isAdmin = false;
    user.memberId = member.id;
    user.refreshToken = '';
    user.isVerified = true;
    user.createdAt = new Date();
    user.createdBy = 'system';

    await this.userRepo.insert(user);

    return { message: 'Đăng ký tài khoản thành công', user: { id: user.id } };
  }

  async forgotPassword(data: ForgotPasswordMemberDto) {
    await this.otpService.verifyOtp(data.identifier, data.otpCode, data.method);

    const isEmail = data.method === 'EMAIL';
    const user = await this.userRepo.findOne({
      where: isEmail
        ? { email: data.identifier }
        : { username: data.identifier },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    const hashedParams = await bcrypt.hash(data.newPassword, 10);
    await this.userRepo.update(user.id, {
      password: hashedParams,
      updatedAt: new Date(),
    });

    return { message: 'Khôi phục mật khẩu thành công' };
  }

  async verifyLoginOtp(
    data: VerifyLoginOtpDto,
    context?: { ipAddress?: string; userAgent?: string },
  ) {
    await this.otpService.verifyOtp(data.identifier, data.otpCode, data.method);

    const isEmail = data.method === 'EMAIL';
    const user = await this.userRepo.findOne({
      where: isEmail
        ? { email: data.identifier }
        : { username: data.identifier },
      relations: { member: true, userRoles: { role: true } },
    });

    if (!user) throw new BadRequestException('Tài khoản không tồn tại');
    if (!user.isActive) {
      await this.createLoginLog({
        userId: user.id,
        actorType: this.determineActorType(user),
        actorId: user.memberId || user.employeeId,
        loginProvider: 'otp',
        status: 'failed',
        failReason: 'account_disabled',
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
      });
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    const payload = { uid: user.id };
    const accessToken = this.jwtService.sign(payload);

    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret';
    const refreshExpiry =
      this.configService.get<string>('JWT_REFRESH_EXPIRY') || '7d';
    const refreshTokenPayload = { uid: user.id, isRefreshToken: true };
    const refreshToken = jwt.sign(refreshTokenPayload, refreshSecret, {
      expiresIn: refreshExpiry,
    } as jwt.SignOptions);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(user.id, {
      refreshToken: hashedRefreshToken,
      lastLoginAt: new Date(),
    });

    await this.createLoginLog({
      userId: user.id,
      actorType: this.determineActorType(user),
      actorId: user.memberId || user.employeeId,
      loginProvider: 'otp',
      status: 'success',
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
      sessionId: accessToken,
    });

    return {
      user: {
        id: user.id,
        code: user.code,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        lastLogin: new Date(),
        member: user.member,
        roles: user.userRoles?.map((ur) => ur.role),
      },
      accessToken,
      refreshToken,
      message: 'Xác thực OTP và đăng nhập thành công',
    };
  }
}
