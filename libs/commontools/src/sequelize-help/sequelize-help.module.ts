import { Global, Module } from '@nestjs/common';
import { SequelizeHelpService } from './sequelize-help.service';

@Global()
@Module({
  providers: [SequelizeHelpService],
  exports: [SequelizeHelpService],
})
export class SequelizeHelpModule {}
