import { Module } from '@nestjs/common';
import { ScriptRunnerService } from './script-runner.service';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule],
  providers: [ScriptRunnerService],
  exports: [ScriptRunnerService],
})
export class ScriptRunnerModule {}
