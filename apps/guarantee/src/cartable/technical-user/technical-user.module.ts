import { Module } from '@nestjs/common';
import { CartableTechnicalUserService } from './technical-user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequest, GSTechnicalPerson } from '@rahino/localdatabase/models';
import { TechnicalUserController } from './technical-user.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([GSTechnicalPerson, GSRequest]),
    LocalizationModule,
  ],
  controllers: [TechnicalUserController],
  providers: [CartableTechnicalUserService],
  exports: [CartableTechnicalUserService],
})
export class CartableTechnicalUserModule {}
