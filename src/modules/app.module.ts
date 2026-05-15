import { CacheModule } from '@nestjs/cache-manager';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { redisStore } from 'cache-manager-redis-yet';
import { CustomThrottlerGuard } from '../common/guards';
import { ContextMiddleware, LoggerMiddleware } from '../middlewares';
import { ActionLogModule } from './action-log/action-log.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ContributionModule } from './contribution/contribution.module';
import { DisbursementModule } from './disbursement/disbursement.module';
import { EmailModule } from './email/email.module';
import { EmployeeModule } from './employee/employee.module';
import { FileArchivalModule } from './file-archival/file-archival.module';
import { FundCycleModule } from './fund-cycle/fund-cycle.module';
import { FundModule } from './fund/fund.module';
import { LoginLogModule } from './login-log/login-log.module';
import { MemberModule } from './member/member.module';
import { NotifyModule } from './notify/notify.module';
import { PermissionModule } from './permission/permission.module';
import { ReceiptModule } from './receipt/receipt.module';
import { RoleModule } from './role/role.module';
import { SystemConfigModule } from './system-config/system-config.module';
import { TransactionModule } from './transaction/transaction.module';
import { UploadFileModule } from './upload-file/upload-file.module';

const globalModules = [
  // ❌ Tắt Redis Cache
  CacheModule.registerAsync({
    useFactory: () => ({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      ttl: 60 * 1000,
    }),
  }),

  // Throttler vẫn giữ, không cần redis
  ThrottlerModule.forRoot([
    {
      name: 'short',
      ttl: 1000,
      limit: Number(process.env.LIMIT_RQ_PER_SECOND_PER_IP) || 10,
    },
    {
      name: 'long',
      ttl: 60000,
      limit: Number(process.env.LIMIT_RQ_PER_MINUTE_PER_IP) || 100,
    },
  ]),
];

@Module({
  imports: [
    ...globalModules,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.prod'
          : process.env.NODE_ENV === 'development'
            ? '.env.dev'
            : '.env',
    }),
    ActionLogModule,
    AuthModule,
    ContributionModule,
    DisbursementModule,
    EmailModule,
    EmployeeModule,
    FileArchivalModule,
    FundCycleModule,
    FundModule,
    LoginLogModule,
    MemberModule,
    NotifyModule,
    PermissionModule,
    ReceiptModule,
    RoleModule,
    SystemConfigModule,
    TransactionModule,
    UploadFileModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ContextMiddleware, LoggerMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
