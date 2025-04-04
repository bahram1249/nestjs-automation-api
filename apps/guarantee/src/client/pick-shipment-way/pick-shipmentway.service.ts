import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@rahino/database';
import { PickShipmentWayDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction } from 'sequelize';
import { TraverseService } from '@rahino/bpmn/modules/traverse/traverse.service';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GSRequest } from '@rahino/localdatabase/models';
import { GuaranteeTraverseService } from '@rahino/guarantee/cartable/guarantee-traverse/guarantee-traverse.service';

@Injectable()
export class PickShipmentWayService {
  constructor(
    private readonly guaranteeTraverseService: GuaranteeTraverseService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly traverseService: TraverseService,
    private readonly localizationService: LocalizationService,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
  ) {}

  async traverse(user: User, dto: PickShipmentWayDto) {
    dto.isClientSideCartable = true;
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
          clientShipmentWayId: dto.clientShipmentWayId,
          clientShipmentWayTrackingCode: dto.clientShipmentWayTrackingCode,
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
