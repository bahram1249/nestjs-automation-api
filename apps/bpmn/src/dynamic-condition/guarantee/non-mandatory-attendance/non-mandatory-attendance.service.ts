import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CheckConditionsDto } from '@rahino/bpmn/modules/condition';
import { ConditionServiceImp } from '@rahino/bpmn/modules/condition/interface';
import { defaultValueIsNull } from '@rahino/commontools/functions/default-value-isnull';
import { GSRequestTypeEnum } from '@rahino/guarantee/shared/request-type';
import { GSProductType, GSRequest } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable({})
export class NonMandatoryAttendanceService implements ConditionServiceImp {
  constructor(
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
  ) {}
  async check(dto: CheckConditionsDto): Promise<boolean> {
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
    return (
      defaultValueIsNull(request.productType.mandatoryAttendance, false) ==
        false && request.requestTypeId != GSRequestTypeEnum.Install
    );
  }
}
