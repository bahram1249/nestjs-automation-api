import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSResponse } from '@rahino/localdatabase/models';
import { User, Permission } from '@rahino/database';
import { GSResponseController } from './response.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([GSResponse, User, Permission]),
    LocalizationModule,
  ],
  controllers: [GSResponseController],
  providers: [ResponseService],
  exports: [ResponseService],
})
export class GSAdminResponseModule {}
