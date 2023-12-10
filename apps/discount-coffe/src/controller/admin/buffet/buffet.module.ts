import { Module } from '@nestjs/common';
import { BuffetService } from './buffet.service';
import { BuffetController } from './buffet.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission])],
  providers: [BuffetService],
  controllers: [BuffetController],
})
export class BuffetModule {}
