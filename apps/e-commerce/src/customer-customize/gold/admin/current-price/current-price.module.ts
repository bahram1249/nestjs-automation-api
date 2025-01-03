import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CurrentPriceController } from './current-price.controller';
import { CurrentPriceService } from './current-price.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { Setting } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, Setting])],
  controllers: [CurrentPriceController],
  providers: [CurrentPriceService],
})
export class CurrentPriceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
