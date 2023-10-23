import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/core/user.entity';
import { Role } from './models/core/role.entity';
import { UserRole } from './models/core/userRole.entity';
import { Menu } from './models/core/menu.entity';
import { Permission } from './models/core/permission.entity';
import { PermissionGroup } from './models/core/permissionGroup.entity';
import { RolePermission } from './models/core/rolePermission.entity';
import { AttachmentType } from './models/core/attachmentType.entity';
import { Attachment } from './models/core/attachment.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';
import { PermissionMenu } from './models/core/permission-menu.entity';

// let config;
// switch (process.env.NODE_ENV) {
//   case 'DEVELOPMENT':
//     config = databaseConfig.development;
//     break;
//   case 'TEST':
//     config = databaseConfig.test;
//     break;
//   case 'PRODUCTION':
//     config = databaseConfig.production;
//     break;
//   case 'PROVISION':
//     config = databaseConfig.provision;
//   default:
//     config = databaseConfig.development;
// }
// config.models = [
//   User,
//   Role,
//   UserRole,
//   Menu,
//   Permission,
//   PermissionGroup,
//   RolePermission,
//   AttachmentType,
//   Attachment,
// ];

const dbSync: boolean = JSON.parse(process.env.DB_SYNCHRONIZE);
const autoLoadModels: boolean = JSON.parse(process.env.DB_AUTO_LOAD_MODELS);

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get<Dialect>('DB_DIALECT'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME_DEVELOPMENT'),
        //[__dirname + '/models/**/*.entity.ts'],
        models: [
          User,
          Role,
          UserRole,
          Menu,
          Permission,
          PermissionGroup,
          RolePermission,
          AttachmentType,
          Attachment,
          PermissionMenu,
        ],
        autoLoadModels: autoLoadModels,

        synchronize: dbSync,
        sync: {
          force: false,
          alter: false,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  // providers: [...databaseProviders],
  // exports: [...databaseProviders],
})
export class DatabaseModule {}
