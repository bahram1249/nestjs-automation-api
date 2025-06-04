import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { RedisClientModule } from '@rahino/redis-client';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { AuthService } from '@rahino/core/auth/auth.service';
import { JwtStrategy } from '@rahino/auth';
import { JwtModule } from '@nestjs/jwt';
import { Menu } from '@rahino/database';
import { RolePermission } from '@rahino/database';
import { PermissionMenu } from '@rahino/database';
import { LOGIN_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/login-sms-sender/constants';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    LocalizationModule,
    JwtModule.register({}),
    RedisClientModule,
    SequelizeModule.forFeature([User, Menu, RolePermission, PermissionMenu]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_ADDRESS'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueueAsync({
      name: LOGIN_SMS_SENDER_QUEUE,
    }),
    // BullBoardModule.forFeature({
    //   name: LOGIN_SMS_SENDER_QUEUE,
    //   adapter: BullMQAdapter,
    // }),
  ],
  controllers: [LoginController],
  providers: [AuthService, JwtStrategy, LoginService],
})
export class LoginModule {}
