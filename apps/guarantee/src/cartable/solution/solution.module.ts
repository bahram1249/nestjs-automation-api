import { Module } from '@nestjs/common';
import { SolutionService } from './solution.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequest, GSSolution } from '@rahino/localdatabase/models';
import { User, Permission } from '@rahino/database';
import { SolutionController } from './solution.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { SolutionProveinceMapper } from './solution-province.mapper';

@Module({
  imports: [
    SequelizeModule,
    LocalizationModule,
    SequelizeModule.forFeature([GSRequest, GSSolution, User, Permission]),
  ],
  controllers: [SolutionController],
  providers: [SolutionService, SolutionProveinceMapper],
  exports: [SolutionService],
})
export class GSCartableSolutionModule {}
