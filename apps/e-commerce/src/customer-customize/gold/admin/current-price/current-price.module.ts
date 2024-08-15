import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CurrentPriceController } from './current-price.controller';
import { CurrentPriceService } from './current-price.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { Setting } from '@rahino/database/models/core/setting.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, Setting])],
  controllers: [CurrentPriceController],
  providers: [CurrentPriceService],
})
export class CurrentPriceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
