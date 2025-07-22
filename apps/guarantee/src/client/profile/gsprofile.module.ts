import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GSProfileController } from './gsprofile.controller';
import { GSProfileService } from './gsprofile.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { User } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User]), LocalizationModule],
  controllers: [GSProfileController],
  providers: [GSProfileService],
  exports: [GSProfileService],
})
export class GSClientProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
