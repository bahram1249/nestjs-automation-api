import { Module } from '@nestjs/common';
import { ColorController } from './color.controller';
import { ColorService } from './color.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { ColorProfile } from './mapper';
import { ECColor } from '@rahino/localdatabase/models';
import { SessionModule } from '../../user/session/session.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECColor]),
    SessionModule,
  ],
  controllers: [ColorController],
  providers: [ColorService, ColorProfile],
})
export class ColorModule {}
