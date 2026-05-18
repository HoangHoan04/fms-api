import { UserRepository } from '@/repositories';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly configService: ConfigService,
    private readonly userRepo: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: { uid: string; isRefreshToken?: boolean }) {
    if (payload.isRefreshToken)
      throw new UnauthorizedException(
        'Không thể dùng refresh token để xác thực',
      );

    const user = await this.userRepo.findOne({
      where: { id: payload.uid, isDeleted: false },
      relations: {
        userRoles: {
          role: {
            rolePermissions: {
              permission: true,
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Không có quyền truy cập!');
    }

    if (user.isDeleted === true) {
      throw new UnauthorizedException('Tài khoản đã bị ngưng hoạt động');
    }

    const roles = user.userRoles?.map((ur) => ur.role) || [];

    const rolePermissionCodes = new Set<string>();
    for (const ur of user.userRoles || []) {
      if (ur.role?.isDeleted !== true) {
        for (const rp of ur.role.rolePermissions || []) {
          if (rp.permission?.code && !rp.isDeleted) {
            rolePermissionCodes.add(rp.permission.code);
          }
        }
      }
    }

    const enhancedUser = {
      id: user.id,
      code: user.code,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      memberId: user.memberId,
      roles,
      permissions: Array.from(rolePermissionCodes),
    };

    return enhancedUser;
  }
}
