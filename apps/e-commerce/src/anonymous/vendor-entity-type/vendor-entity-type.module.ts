import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VendorEntityTypeController } from './vendor-entity-type.controller';
import { VendorEntityTypeService } from './vendor-entity-type.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [SequelizeModule.forFeature([EAVEntityType]), LocalizationModule],
  controllers: [VendorEntityTypeController],
  providers: [VendorEntityTypeService],
  exports: [VendorEntityTypeService],
})
export class AnonymousVendorEntityTypeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
