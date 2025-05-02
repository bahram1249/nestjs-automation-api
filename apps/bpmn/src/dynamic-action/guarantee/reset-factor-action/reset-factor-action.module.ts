import { Module } from '@nestjs/common';
import { ResetFactorActionService } from './reset-factor-action.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSFactor } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([GSFactor])],
  providers: [
    { provide: 'ResetFactorActionService', useClass: ResetFactorActionService },
  ],
})
export class ResetFactorActionModule {}
