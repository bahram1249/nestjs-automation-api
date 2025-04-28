import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EntityTypeController } from './entity-type.controller';
import { EntityTypeService } from './entity-type.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [SequelizeModule.forFeature([EAVEntityType]), LocalizationModule],
  controllers: [EntityTypeController],
  providers: [EntityTypeService],
  exports: [EntityTypeService],
})
export class ClientEntityTypeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
