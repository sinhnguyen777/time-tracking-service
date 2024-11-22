import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { UsersModule } from './users/users.module';
import { getDatabaseConfig } from './config';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { TimekeepingModule } from './timekeeping/timekeeping.module';
import { RequestModule } from './request/request.module';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          cors: {
            origin: [
              'http://localhost:3000',
              'https://develop-time-tracking-ute.vercel.app/',
              'https://time-tracking-ute.vercel.app/',
            ],
            credentials: true,
          },
        }),
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
    }),
    UsersModule,
    AuthModule,
    TimekeepingModule,
    RequestModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useValue: 'NestJS MongoDB',
    },
  ],
})
export class AppModule {}
