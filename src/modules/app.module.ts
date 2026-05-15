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
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { MemberModule } from './member/member.module';

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
    AuthModule,
    MemberModule,
    EmployeeModule,
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
