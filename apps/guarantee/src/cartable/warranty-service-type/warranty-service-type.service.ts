import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetWarrantyServiceTypeDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSRequest, GSWarrantyServiceType } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GSRequestCategoryEnum } from '@rahino/guarantee/shared/request-category';
import { GSWarrantyServiceTypeEnum } from '@rahino/guarantee/shared/warranty-service-type';

@Injectable()
export class CartableWarrantyServiceTypeService {
  constructor(
    @InjectModel(GSWarrantyServiceType)
    private readonly repository: typeof GSWarrantyServiceType,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(requestId: bigint, filter: GetWarrantyServiceTypeDto) {
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: requestId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSRequest.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!request) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.guarantee_request_item_not_founded',
        ),
      );
    }

    const warrantyServiceTypes = this.getWarrantyServiceTypes(
      request.requestCategoryId,
    );
    let query = new QueryOptionsBuilder().filter({
      id: {
        [Op.in]: warrantyServiceTypes,
      },
    });

    const count = await this.repository.count(query.build());

    query = query
      .attributes(['id', 'title'])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ sortOrder: filter.sortOrder, orderBy: filter.orderBy });

    const result = await this.repository.findAll(query.build());

    return {
      result: result,
      total: count,
    };
  }

  private getWarrantyServiceTypes(requestCategoryId: number) {
    let types: number[] = [];
    switch (requestCategoryId) {
      case GSRequestCategoryEnum.NormalGuarantee:
        types = [
          GSWarrantyServiceTypeEnum.IncludeWarranty,
          GSWarrantyServiceTypeEnum.OutOfWarranty,
        ];
        break;
      case GSRequestCategoryEnum.VIPGuarantee:
        types = [
          GSWarrantyServiceTypeEnum.IncludeWarranty,
          GSWarrantyServiceTypeEnum.OutOfWarranty,
        ];
        break;
      case GSRequestCategoryEnum.WithoutGuarantee:
        types = [GSWarrantyServiceTypeEnum.OutOfWarranty];
        break;
      default:
        throw new InternalServerErrorException('invalid request category type');
    }
    return types;
  }
}
