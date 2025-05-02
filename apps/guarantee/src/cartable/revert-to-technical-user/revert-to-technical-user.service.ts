import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@rahino/database';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { GSRequest } from '@rahino/localdatabase/models';
import { Op, Sequelize, Transaction } from 'sequelize';
import { GuaranteeTraverseService } from '../guarantee-traverse/guarantee-traverse.service';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { TraverseService } from '@rahino/bpmn/modules/traverse/traverse.service';
import { LocalizationService } from 'apps/main/src/common/localization';
import { RevertToTechncialUserDto } from './dto';
@Injectable()
export class RevertToTechnicalUserService {
  constructor(
    @InjectModel(GSRequest) private readonly repository: typeof GSRequest,
    private readonly guaranteeTraverseService: GuaranteeTraverseService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly traverseService: TraverseService,
    private readonly localizationService: LocalizationService,
  ) {}

  async traverse(user: User, dto: RevertToTechncialUserDto) {
    const cartableItem =
      await this.guaranteeTraverseService.validateAndReturnCartableItem(
        user,
        dto,
      );
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      // guarantee request
      const guaranteeRequest = await this.repository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: cartableItem.request.id })
          .transaction(transaction)
          .build(),
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
        users: [{ userId: guaranteeRequest.technicalUserId }],
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
