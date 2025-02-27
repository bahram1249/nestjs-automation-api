import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { AgeService } from './age.service';
import { AgeController } from './age.controller';
import { PCMAge } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, PCMAge])],
  controllers: [AgeController],
  providers: [AgeService],
})
export class AgeModule {}
