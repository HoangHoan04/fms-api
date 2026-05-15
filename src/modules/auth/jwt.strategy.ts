import { UserRepository } from '@/repositories';
import {
  PermissionRepository,
  RolePermissionRepository,
  UserPermissionRepository,
} from '@/repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly configService: ConfigService,
    private readonly userRepo: UserRepository,
    private readonly userPermissionRepo: UserPermissionRepository,
    private readonly rolePermissionRepo: RolePermissionRepository,
    private readonly permissionRepo: PermissionRepository,
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
        userPermissions: {
          permission: true,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Không có quyền truy cập!');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị ngưng hoạt động');
    }

    const roles = user.userRoles?.map((ur) => ur.role) || [];

    // Collect role-based permissions (from active roles only)
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

    // Collect user-specific permissions (Allow/Deny)
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

    // Merge: role permissions + user allow, then remove denied
    const finalPermissions = [
      ...rolePermissionCodes,
      ...userAllowPermissions,
    ].filter((p) => !userDenyPermissions.has(p));

    const enhancedUser = {
      id: user.id,
      code: user.code,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      memberId: user.memberId,
      employeeId: user.employeeId,
      roles,
      permissions: finalPermissions,
    };

    return enhancedUser;
  }
}
