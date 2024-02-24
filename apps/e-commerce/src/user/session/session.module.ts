import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECUserSession } from '@rahino/database/models/ecommerce-eav/ec-user-session.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECUserSession])],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
