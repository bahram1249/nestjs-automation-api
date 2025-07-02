import { Module } from '@nestjs/common';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProvince } from '@rahino/localdatabase/models';
import { SessionModule } from '../../user/session/session.module';

@Module({
  imports: [SessionModule, SequelizeModule.forFeature([ECProvince])],
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class ProvinceModule {}
