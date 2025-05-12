import { Module } from '@nestjs/common';
import { PostageFeeController } from './postage-fee.controller';
import { PostageFeeService } from './postage-fee.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { ECPostageFee } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECPostageFee])],
  controllers: [PostageFeeController],
  providers: [PostageFeeService],
})
export class PostageFeeModule {}
