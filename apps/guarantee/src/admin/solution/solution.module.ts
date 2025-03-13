import { Module } from '@nestjs/common';
import { SolutionService } from './solution.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSSolution } from '@rahino/localdatabase/models';
import { User, Permission } from '@rahino/database';
import { SolutionController } from './solution.controller';
import { SolutionProfile } from './mapper';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([GSSolution, User, Permission]),
  ],
  controllers: [SolutionController],
  providers: [SolutionService, SolutionProfile],
  exports: [SolutionService],
})
export class GSSolutionModule {}
