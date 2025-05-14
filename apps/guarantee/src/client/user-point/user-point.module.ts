import { Module } from '@nestjs/common';
import { UserPointService } from './user-point.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSUserPoint } from '@rahino/localdatabase/models';
import { UserPointControler } from './user-point.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { QueryFilterModule } from '@rahino/query-filter';

@Module({
  imports: [
    SequelizeModule,
    LocalizationModule,
    SequelizeModule.forFeature([GSUserPoint]),
    QueryFilterModule,
  ],
  controllers: [UserPointControler],
  providers: [UserPointService],
  exports: [UserPointService],
})
export class UserPointModule {}
