import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetSolutionDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  GSAddress,
  GSGuaranteeOrganization,
  GSProvince,
  GSRequest,
  GSSolution,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { LocalizationService } from 'apps/main/src/common/localization';
import { SolutionProveinceMapper } from './solution-province.mapper';
import { GetSolutionRequestFilterDto } from './dto/get-solution-request-filter.dto';

@Injectable()
export class SolutionService {
  constructor(
    @InjectModel(GSSolution)
    private readonly repository: typeof GSSolution,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    private readonly localizationService: LocalizationService,
    private readonly solutionProvinceMapper: SolutionProveinceMapper,
  ) {}

  async findAll(filter: GetSolutionDto) {
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: GSGuaranteeOrganization,
            as: 'guaranteeOrganization',
            required: true,
            include: [{ model: GSAddress, as: 'address' }],
          },
        ])
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSRequest.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ id: filter.requestId })
        .build(),
    );

    if (!request) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.guarantee_request_item_not_founded',
        ),
      );
    }

    let query = new QueryOptionsBuilder()
      .filter({
        title: {
          [Op.like]: filter.search,
        },
      })

      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('GSSolution.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const count = await this.repository.count(query.build());

    query = query
      .attributes(['id', 'title', 'fee', 'createdAt', 'updatedAt'])
      .include([
        {
          model: GSSolution,
          as: 'provinceSolutions',
          required: false,
          include: [
            { attributes: ['id', 'name'], model: GSProvince, as: 'province' },
          ],
          where: {
            provinceId: request.guaranteeOrganization.address.provinceId,
          },
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());
    const mappedItems = await this.solutionProvinceMapper.mapItems(results);

    return {
      result: mappedItems,
      total: count,
    };
  }

  async findById(entityId: number, filter: GetSolutionRequestFilterDto) {
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: GSGuaranteeOrganization,
            as: 'guaranteeOrganization',
            required: true,
            include: [{ model: GSAddress, as: 'address' }],
          },
        ])
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSRequest.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ id: filter.requestId })
        .build(),
    );

    if (!request) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.guarantee_request_item_not_founded',
        ),
      );
    }

    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'title', 'fee', 'createdAt', 'updatedAt'])
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSSolution.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .include([
          {
            model: GSSolution,
            as: 'provinceSolutions',
            required: false,
            include: [
              { attributes: ['id', 'name'], model: GSProvince, as: 'province' },
            ],
            where: {
              provinceId: request.guaranteeOrganization.address.provinceId,
            },
          },
        ])
        .filter({ id: entityId })
        .build(),
    );

    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    const mappedItem = await this.solutionProvinceMapper.map(item);

    return {
      result: mappedItem,
    };
  }
}
