import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import {
  FileArchivalRepository,
  MemberRepository,
  PermissionRepository,
  RolePermissionRepository,
  UserPermissionRepository,
  UserRepository,
  VerifyOtpRepository,
} from '@/repositories';
import { OtpService } from '@/services/otp.service';
import { TypeOrmExModule } from '@/typeorm';
import { EmailModule } from '../email/email.module';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { NotifyModule } from '../notify/notify.module';
import { AuthService } from './auth.service';
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
      VerifyOtpRepository,
      PermissionRepository,
      RolePermissionRepository,
      UserPermissionRepository,
    ]),
    HttpModule,
    FileArchivalModule,
    EmailModule,
    NotifyModule,
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy, OtpService],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
