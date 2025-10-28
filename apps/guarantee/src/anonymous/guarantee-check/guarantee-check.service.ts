import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GSBrand,
  GSGuarantee,
  GSGuaranteePeriod,
  GSProductType,
  GSVariant,
} from '@rahino/localdatabase/models';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { GSGuaranteeConfirmStatus } from '@rahino/guarantee/shared/guarantee-confirm-status';
import { LocalizationService } from 'apps/main/src/common/localization';
@Injectable()
export class GuaranteeCheckService {
  constructor(
    @InjectModel(GSGuarantee)
    private readonly guaranteeRepository: typeof GSGuarantee,
    private readonly localizationService: LocalizationService,
  ) {}

  async getDetail(serialNumber: string) {
    const guarantee = await this.guaranteeRepository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'serialNumber',
          'startDate',
          'endDate',
          'variantId',
          'brandId',
          'productTypeId',
        ])
        .include([
          { model: GSProductType, as: 'productType', required: false },
          { model: GSVariant, as: 'variant', required: false },
          { model: GSBrand, as: 'brand', required: false },
          { model: GSGuaranteePeriod, as: 'guaranteePeriod', required: false },
        ])
        .filter({ serialNumber: serialNumber })
        .filter({ guaranteeConfirmStatusId: GSGuaranteeConfirmStatus.Confirm })
        .build(),
    );

    if (!guarantee) {
      throw new NotFoundException(
        this.localizationService.translate(
          'guarantee.details_of_requested_card_is_not_found',
        ),
      );
    }
    return { result: guarantee };
  }
}
