import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExecuteActionDto } from '@rahino/bpmn/modules/action/dto';
import { ActionServiceImp } from '@rahino/bpmn/modules/action/interface';
import { defaultValueIsNull } from '@rahino/commontools/functions/default-value-isnull';
import { GSRequestTypeEnum } from '@rahino/guarantee/shared/request-type';
import { GSProductType, GSRequest } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class UpdateRequestMandatoryAttendanceActionService
  implements ActionServiceImp
{
  constructor(
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
  ) {}
  async executeAction(dto: ExecuteActionDto) {
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: GSProductType,
            as: 'productType',
          },
        ])
        .filter({ id: dto.request.id })
        .transaction(dto.transaction)
        .build(),
    );
    // update request mandatory attendance
    await this.requestRepository.update(
      {
        mandatoryAttendance:
          defaultValueIsNull(request.productType.mandatoryAttendance, false) ==
            true || request.requestTypeId == GSRequestTypeEnum.Install,
      },
      {
        where: {
          id: dto.request.id,
        },
        transaction: dto.transaction,
      },
    );
  }
}
