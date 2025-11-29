import { BadRequestException, Injectable } from '@nestjs/common';
import { Attachment, User } from '@rahino/database';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { GSRequest, GSRequestAttachment } from '@rahino/localdatabase/models';
import { Op, Sequelize, Transaction } from 'sequelize';
import { GuaranteeTraverseService } from '../guarantee-traverse/guarantee-traverse.service';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { TraverseService } from '@rahino/bpmn/modules/traverse/traverse.service';
import { LocalizationService } from 'apps/main/src/common/localization';
import { SubmitFactorInRequestLocationDto } from './dto';
import { GSRequestAttachmentTypeEnum } from '@rahino/guarantee/shared/request-attachment-type';

@Injectable()
export class SubmitFactorInRequestLocationService {
  private photoTempAttachmentType = 19;
  private photoAttachmentType = 20;
  constructor(
    @InjectModel(GSRequest) private readonly repository: typeof GSRequest,
    private readonly guaranteeTraverseService: GuaranteeTraverseService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly traverseService: TraverseService,
    private readonly localizationService: LocalizationService,
    @InjectModel(GSRequestAttachment)
    private readonly requestAttachmentRepository: typeof GSRequestAttachment,
    @InjectModel(Attachment)
    private readonly attachmentRepository: typeof Attachment,
  ) {}

  async traverse(user: User, dto: SubmitFactorInRequestLocationDto) {
    // if (dto.attachments.length == 0) {
    //   throw new BadRequestException(
    //     this.localizationService.translate(
    //       'guarantee.you_have_to_upload_a_image_at_least_one',
    //     ),
    //   );
    // }

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

      const isCash = !(dto.isOnline == true);
      await this.repository.update(
        {
          isCash: isCash,
        },
        {
          where: {
            id: cartableItem.request.id,
          },
          transaction: transaction,
        },
      );
      if (dto.attachments.length > 0) {
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
                GSRequestAttachmentTypeEnum.SubmitByOrganizationOnRequestEnd,
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
