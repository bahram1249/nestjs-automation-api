import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSQuestion } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([GSQuestion])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class GSClientQuestionModule {}
