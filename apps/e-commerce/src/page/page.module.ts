import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPage } from '@rahino/database/models/ecommerce-eav/ec-page.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECPage])],
  controllers: [PageController],
  providers: [PageService],
})
export class PageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
