import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@rahino/database';
import { SubmitSurveyDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';
import { TraverseService } from '@rahino/bpmn/modules/traverse/traverse.service';
import { LocalizationService } from 'apps/main/src/common/localization';
import {
  GSAnswerOption,
  GSAnswerRecord,
  GSQuestion,
  GSRequest,
  GSResponse,
} from '@rahino/localdatabase/models';
import { GuaranteeTraverseService } from '@rahino/guarantee/cartable/guarantee-traverse/guarantee-traverse.service';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';

@Injectable()
export class SubmitSurveyService {
  constructor(
    private readonly guaranteeTraverseService: GuaranteeTraverseService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly traverseService: TraverseService,
    private readonly localizationService: LocalizationService,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    @InjectModel(GSQuestion)
    private readonly questionRepository: typeof GSQuestion,
    @InjectModel(GSAnswerRecord)
    private readonly answerRecordRepository: typeof GSAnswerRecord,
    @InjectModel(GSResponse)
    private readonly responseRepository: typeof GSResponse,
  ) {}

  async traverse(user: User, dto: SubmitSurveyDto) {
    dto.isClientSideCartable = true;
    const cartableItem =
      await this.guaranteeTraverseService.validateAndReturnCartableItem(
        user,
        dto,
      );

    const questions = await this.questionRepository.findAll(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSQuestion.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .include([{ model: GSAnswerOption, as: 'answerOptions' }])
        .build(),
    );

    if (questions.length != dto.repsponses.length) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.the_count_of_question_is_not_true',
        ),
      );
    }

    let fromScore: number = 0;
    let totalScore: number = 0;

    const totalWeights = questions.map((question) => question.maxWeight);
    fromScore = totalWeights.reduce((a, b) => a + b, 0);

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      const response = await this.responseRepository.create(
        {
          requestId: cartableItem.request.id,
          fromScore: fromScore,
          totalScore: totalScore,
          userId: user.id,
        },
        { transaction: transaction },
      );
      // insert survey
      for (const answer of dto.repsponses) {
        const question = questions.find(
          (question) => Number(question.id) == answer.questionId,
        );
        if (!question) {
          throw new BadRequestException('invalid question id');
        }
        const findAnswer = question.answerOptions.find(
          (answerOption) => Number(answerOption.id) == answer.answerOptionId,
        );
        if (!findAnswer) {
          throw new BadRequestException('invalid answer option id');
        }

        totalScore += findAnswer.weight;
        const answerRecord = await this.answerRecordRepository.create(
          {
            responseId: response.id,
            questionId: question.id,
            answerOptionId: findAnswer.id,
            weight: findAnswer.weight,
          },
          { transaction: transaction },
        );
      }

      await this.responseRepository.update(
        { totalScore: totalScore },
        {
          where: {
            id: response.id,
          },
          transaction: transaction,
        },
      );

      // lets traverse request
      await this.traverseService.traverse({
        request: cartableItem.request,
        requestState: cartableItem.requestState,
        node: cartableItem.node,
        nodeCommand: cartableItem.nodeCommand,
        transaction: transaction,
        userExecuterId: user.id,
      });

      // apply changes
      await transaction.commit();
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }
    return {
      result: {
        message: this.localizationService.translate('core.success'),
      },
    };
  }
}
