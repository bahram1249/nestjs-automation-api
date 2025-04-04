import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@rahino/database';
import { PickTechnicalUserDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';
import { GuaranteeTraverseService } from '../guarantee-traverse/guarantee-traverse.service';
import { TraverseService } from '@rahino/bpmn/modules/traverse/traverse.service';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GSRequest } from '@rahino/localdatabase/models';

@Injectable()
export class PickTechnicalUserService {
  constructor(
    private readonly guaranteeTraverseService: GuaranteeTraverseService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly traverseService: TraverseService,
    private readonly localizationService: LocalizationService,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
  ) {}

  async traverse(user: User, dto: PickTechnicalUserDto) {
    const cartableItem =
      await this.guaranteeTraverseService.validateAndReturnCartableItem(
        user,
        dto,
      );
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      // update request
      await this.requestRepository.update(
        {
          technicalUserId: dto.userId,
          technicalUserVisitDate: dto.technicalUserVisitDate,
          technicalUserVisitTime: dto.technicalUserVisitTime,
        },
        {
          where: {
            id: cartableItem.request.id,
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
        description: dto.description,
        userExecuterId: user.id,
        users: [{ userId: dto.userId }],
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
