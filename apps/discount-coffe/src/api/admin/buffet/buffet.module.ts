import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { BuffetService } from './buffet.service';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { BuffetController } from './buffet.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, Buffet])],
  providers: [BuffetService],
  controllers: [BuffetController],
})
export class BuffetModule {}
