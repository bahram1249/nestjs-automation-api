import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LinkedEntityTypeBrandController } from './linked-entity-type-brand.controller';
import { LinkedEntityTypeBrandService } from './linked-entity-type-brand.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { LinkedEntityTypeBrandProfile } from './mapper';
import { ECLinkedEntityTypeBrand } from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECLinkedEntityTypeBrand]),
    LocalizationModule,
  ],
  controllers: [LinkedEntityTypeBrandController],
  providers: [LinkedEntityTypeBrandService, LinkedEntityTypeBrandProfile],
})
export class AdminLinkedEntityTypeBrandModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
