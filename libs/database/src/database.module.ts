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
import { PersianDate } from './models/core/view/persiandate.entity';
import { WinstonLog } from './models/core/winstonlog.entity';
import { PCMPeriodType } from './models/pcm/pcm-period-type.entity';
import { PCMPeriod } from './models/pcm/pcm-period.entity';
import { PCMAge } from './models/pcm/pcm-age.entity';
import { PCMArticleType } from './models/pcm/pcm-article-type.entity';
import { PCMPublish } from './models/pcm/pcm-publish.entity';
import { PCMArticle } from './models/pcm/pcm-article.entity';
import { EAVEntityModel } from './models/eav/eav-entity-model.entity';
import { EAVEntityType } from './models/eav/eav-entity-type.entity';
import { EAVEntity } from './models/eav/eav-entity.entity';
import { ECProduct } from './models/ecommerce-eav/ec-product.entity';
import { EAVAttributeType } from './models/eav/eav-attribute-type.entity';
import { Buffet } from './models/discount-coffe/buffet.entity';
import { BuffetType } from './models/discount-coffe/buffet-type.entity';
import { BuffetCost } from './models/discount-coffe/buffet-cost.entity';
import { BuffetCity } from './models/discount-coffe/city.entity';
import { CoffeOption } from './models/discount-coffe/coffe-option.entity';
import { BuffetOption } from './models/discount-coffe/buffet-option.entity';
import { BuffetMenuCategory } from './models/discount-coffe/buffet-menu-category.entity';
import { BuffetMenu } from './models/discount-coffe/buffet-menu.entity';
import { BuffetReserveStatus } from './models/discount-coffe/buffet-reserve-status.entity';
import { BuffetReserve } from './models/discount-coffe/buffet-reserve.entity';
import { BuffetReserveType } from './models/discount-coffe/buffet-reserve-type.entity';
import { BuffetReserveDetail } from './models/discount-coffe/buffet-reserve-detail.entity';
import { VW_BuffetReservers } from './models/discount-coffe/vw_buffet_reserve.entity';
import { EAVAttribute } from './models/eav/eav-attribute.entity';
import { EAVAttributeValue } from './models/eav/eav-attribute-value';
import { ECPublishStatus } from './models/ecommerce-eav/ec-publish-status.entity';
import { ECProvince } from './models/ecommerce-eav/ec-province.entity';
import { ECCity } from './models/ecommerce-eav/ec-city.entity';
import { ECNeighborhood } from './models/ecommerce-eav/ec-neighborhood.entity';
import { ECAddress } from './models/ecommerce-eav/ec-address.entity';
import { ECInventoryStatus } from './models/ecommerce-eav/ec-inventory-status.entity';
import { ECBrand } from './models/ecommerce-eav/ec-brand.entity';
import { ECColor } from './models/ecommerce-eav/ec-color.entity';
import { ECGuarantee } from './models/ecommerce-eav/ec-guarantee.entity';
import { ECGuaranteeMonth } from './models/ecommerce-eav/ec-guarantee-month.entity';
import { EAVEntityAttributeValue } from './models/eav/eav-entity-attribute-value.entity';
import { EAVEntityPhoto } from './models/eav/eav-entity-photo.entity';

const dbSync: boolean = JSON.parse(process.env.DB_SYNCHRONIZE);
const autoLoadModels: boolean = JSON.parse(process.env.DB_AUTO_LOAD_MODELS);
const dbLog: boolean = JSON.parse(process.env.DB_LOG);

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
          WinstonLog,
          PersianDate,
          PCMPeriodType,
          PCMPeriod,
          PCMAge,
          PCMArticleType,
          PCMPublish,
          PCMArticle,
          EAVEntityModel,
          EAVEntityType,
          EAVEntity,
          EAVAttributeType,
          EAVAttribute,
          EAVAttributeValue,
          EAVEntityAttributeValue,
          EAVEntityPhoto,
          ECPublishStatus,
          ECInventoryStatus,
          ECColor,
          ECGuarantee,
          ECGuaranteeMonth,
          ECBrand,
          ECProvince,
          ECCity,
          ECNeighborhood,
          ECAddress,
          ECProduct,
          Buffet,
          BuffetType,
          BuffetCost,
          BuffetCity,
          CoffeOption,
          BuffetOption,
          BuffetMenuCategory,
          BuffetMenu,
          BuffetReserveStatus,
          BuffetReserveType,
          BuffetReserve,
          BuffetReserveDetail,
          VW_BuffetReservers,
        ],
        autoLoadModels: autoLoadModels,
        logging: dbLog,
        synchronize: dbSync,
        sync: {
          force: false,
          alter: false,
        },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forRootAsync({
      name: 'view',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get<Dialect>('DB_DIALECT'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME_DEVELOPMENT'),
        //[__dirname + '/models/**/*.entity.ts'],
        models: [PersianDate],
        autoLoadModels: autoLoadModels,
        synchronize: false,
        sync: {
          force: false,
          alter: {
            drop: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  // providers: [...databaseProviders],
  // exports: [...databaseProviders],
})
export class DatabaseModule {}
