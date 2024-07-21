import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HomePageController } from './home-page.controller';
import { HomePageService } from './home-page.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { ECHomePage } from '@rahino/database/models/ecommerce-eav/ec-home-page.entity';
import { HomePageValidatorService } from './home-page-validator.service';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { ECEntityTypeSort } from '@rahino/database/models/ecommerce-eav/ec-entityType-sort.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      ECHomePage,
      Attachment,
      EAVEntityType,
      ECEntityTypeSort,
    ]),
  ],
  controllers: [HomePageController],
  providers: [HomePageService, HomePageValidatorService],
})
export class AdminHomePageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
