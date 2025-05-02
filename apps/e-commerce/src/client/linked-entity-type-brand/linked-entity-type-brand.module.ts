import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LinkedEntityTypeBrandController } from './linked-entity-type-brand.controller';
import { LinkedEntityTypeBrandService } from './linked-entity-type-brand.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECLinkedEntityTypeBrand } from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([ECLinkedEntityTypeBrand]),
    LocalizationModule,
  ],
  controllers: [LinkedEntityTypeBrandController],
  providers: [LinkedEntityTypeBrandService],
})
export class ClientLinkedEntityTypeBrandModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
