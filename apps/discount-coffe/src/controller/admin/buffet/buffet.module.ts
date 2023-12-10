import { Module } from '@nestjs/common';
import { BuffetService } from './buffet.service';
import { BuffetController } from './buffet.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, Buffet])],
  controllers: [BuffetController],
  providers: [BuffetService],
})
export class BuffetModule {}
