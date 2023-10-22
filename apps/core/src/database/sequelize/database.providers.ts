import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './database.config';
import { User } from './models/core/user.entity';
import { Role } from './models/core/role.entity';
import { RolePermission } from './models/core/rolePermission.entity';
import { Permission } from './models/core/permission.entity';
import { PermissionGroup } from './models/core/permissionGroup.entity';
import { Menu } from './models/core/menu.entity';
import { AttachmentType } from './models/core/attachmentType.entity';
import { Attachment } from './models/core/attachment.entity';
import { UserRole } from './models/core/userRole.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case 'DEVELOPMENT':
          config = databaseConfig.development;
          break;
        case 'TEST':
          config = databaseConfig.test;
          break;
        case 'PRODUCTION':
          config = databaseConfig.production;
          break;
        case 'PROVISION':
          config = databaseConfig.provision;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([
        User,
        Role,
        UserRole,
        Menu,
        Permission,
        PermissionGroup,
        RolePermission,
        AttachmentType,
        Attachment,
      ]);
      return sequelize;
    },
  },
];
