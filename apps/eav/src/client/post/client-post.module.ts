import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EAVPost } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([EAVPost])],
})
export class ClientPostModule {}
