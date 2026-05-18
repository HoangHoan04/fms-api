import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import {
  FileArchivalRepository,
  LoginLogRepository,
  MemberRepository,
  PermissionRepository,
  RolePermissionRepository,
  UserRepository,
} from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { NotifyModule } from '../notify/notify.module';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth-admin.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRY') || '1h') as any,
        },
      }),
    }),
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      MemberRepository,
      FileArchivalRepository,
      LoginLogRepository,
      PermissionRepository,
      RolePermissionRepository,
    ]),
    HttpModule,
    FileArchivalModule,
    // EmailModule,
    NotifyModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
