import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { PageProfile } from './mapper';
import { ECPage } from '@rahino/database/models/ecommerce-eav/ec-page.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECPage])],
  controllers: [PageController],
  providers: [PageService, PageProfile],
})
export class AdminPageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
