import { Module } from '@nestjs/common';
import { PostageFeeController } from './postage-fee.controller';
import { PostageFeeService } from './postage-fee.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { ECPostageFee } from '@rahino/database/models/ecommerce-eav/ec-postage-fee.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECPostageFee])],
  controllers: [PostageFeeController],
  providers: [PostageFeeService],
})
export class PostageFeeModule {}
