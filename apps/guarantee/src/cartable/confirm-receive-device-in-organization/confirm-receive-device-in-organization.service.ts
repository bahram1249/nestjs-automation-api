import { BadRequestException, Injectable } from '@nestjs/common';
import { Attachment, User } from '@rahino/database';
import { ConfirmRequestDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize, Transaction } from 'sequelize';
import { GuaranteeTraverseService } from '../guarantee-traverse/guarantee-traverse.service';
import { TraverseService } from '@rahino/bpmn/modules/traverse/traverse.service';
import { LocalizationService } from 'apps/main/src/common/localization';
import {
  GSRequestItem,
  GSRequestAttachment,
} from '@rahino/localdatabase/models';
import { RequestItemTypeEnum } from '@rahino/guarantee/shared/request-item-type';
import { RequestItemDto } from './dto/request-item.dto';
import { GSRequestAttachmentTypeEnum } from '@rahino/guarantee/shared/request-attachment-type';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class ConfirmReceiveDeviceInOrganizationService {
  private photoTempAttachmentType = 19;
  private photoAttachmentType = 20;
  constructor(
    private readonly guaranteeTraverseService: GuaranteeTraverseService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly traverseService: TraverseService,
    private readonly localizationService: LocalizationService,
    @InjectModel(GSRequestItem)
    private readonly requestItemRepository: typeof GSRequestItem,
    @InjectModel(GSRequestAttachment)
    private readonly requestAttachmentRepository: typeof GSRequestAttachment,
    @InjectModel(Attachment)
    private readonly attachmentRepository: typeof Attachment,
  ) {}

  async traverse(user: User, dto: ConfirmRequestDto) {
    const cartableItem =
      await this.guaranteeTraverseService.validateAndReturnCartableItem(
        user,
        dto,
      );
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      await this.createRequestItems(
        user,
        cartableItem.request.id,
        dto.items,
        transaction,
      );
      if (dto.attachments?.length > 0) {
        for (const attachmentDto of dto.attachments) {
          const findAttachment = await this.attachmentRepository.findOne(
            new QueryOptionsBuilder()
              .filter({ id: attachmentDto.attachmentId })
              .filter({ attachmentTypeId: this.photoTempAttachmentType })
              .filter(
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('Attachment.isDeleted'),
                    0,
                  ),
                  {
                    [Op.eq]: 0,
                  },
                ),
              )
              .transaction(transaction)
              .build(),
          );
          if (!findAttachment) {
            throw new BadRequestException(
              this.localizationService.translate(
                'core.dont_access_to_this_file',
              ),
            );
          }

          findAttachment.attachmentTypeId = this.photoAttachmentType;
          await findAttachment.save({ transaction: transaction });

          await this.requestAttachmentRepository.create(
            {
              requestId: cartableItem.request.id,
              attachmentId: findAttachment.id,
              requestAttachmentTypeId:
                GSRequestAttachmentTypeEnum.SubmitByOrganizationWhenRecived,
              userId: user.id,
            },
            { transaction: transaction },
          );
        }
      }
      // lets traverse request
      await this.traverseService.traverse({
        request: cartableItem.request,
        requestState: cartableItem.requestState,
        node: cartableItem.node,
        nodeCommand: cartableItem.nodeCommand,
        transaction: transaction,
        description: dto.description,
        userExecuterId: user.id,
      });

      // apply changes
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }
    return {
      result: {
        message: this.localizationService.translate('core.success'),
      },
    };
  }

  private async createRequestItems(
    user: User,
    requestId: bigint,
    items: RequestItemDto[] | undefined,
    transaction: Transaction,
  ) {
    if (!items?.length) {
      return;
    }

    for (const item of items) {
      await this.requestItemRepository.create(
        {
          requestId,
          title: item.title,
          barcode: item.barcode,
          userId: user.id,
          requestItemTypeId:
            RequestItemTypeEnum.SubmitByOrganizationWhenRecived,
        },
        { transaction },
      );
    }
  }
}
