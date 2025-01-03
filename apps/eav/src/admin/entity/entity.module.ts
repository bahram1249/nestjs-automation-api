import { Module } from '@nestjs/common';
import { EntityService } from './entity.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVEntity } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([EAVEntity])],
  providers: [EntityService],
  exports: [EntityService],
})
export class EntityModule {}
