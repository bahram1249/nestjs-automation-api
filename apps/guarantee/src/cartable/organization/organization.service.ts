import { BadRequestException, Injectable } from '@nestjs/common';
import { GetOrganizationDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNOrganization,
  GSAddress,
  GSCity,
  GSGuaranteeOrganization,
  GSProvince,
  GSRequest,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { LocalizationService } from 'apps/main/src/common/localization';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class CartableOrganizationService {
  constructor(
    @InjectModel(GSGuaranteeOrganization)
    private readonly repository: typeof GSGuaranteeOrganization,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    private readonly localizationService: LocalizationService,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll(requestId: bigint, filter: GetOrganizationDto) {
    const request = await this.requestRepository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: GSAddress,
            as: 'address',
            required: true,
          },
        ])
        .filter({ id: requestId })
        .filter(
          this.seqHelp.whereIsNullColumnEqualToZero('GSRequest.isDeleted', 0),
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

    const query = new QueryOptionsBuilder()
      .include([
        {
          model: GSAddress,
          as: 'address',
          required: true,
          include: [
            {
              model: GSProvince,
              as: 'province',
              required: true,
            },
            {
              model: GSCity,
              as: 'city',
              required: false,
            },
          ],
        },
      ])
      .thenInclude({
        attributes: ['id', 'name'],
        model: BPMNOrganization,
        as: 'organization',
        required: true,
        where: {
          name: {
            [Op.like]: filter.search,
          },
        },
      })
      .filter(
        this.seqHelp.whereIsNullColumnEqualToZero(
          'GSGuaranteeOrganization.isDeleted',
          0,
        ),
      )
      .filter({
        [Op.or]: [
          { isNationwide: true },
          { '$address.provinceId$': request.address.provinceId },
        ],
      })
      .filter(
        Sequelize.literal(
          `EXISTS (
          SELECT 1
          FROM GSGuaranteeOrganizationContracts GGOC
          WHERE GGOC.organizationId = GSGuaranteeOrganization.id
          AND GETDATE() BETWEEN GGOC.startDate AND GGOC.endDate
        )`.replaceAll(/\s\s+/g, ' '),
        ),
      )
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ sortOrder: filter.sortOrder, orderBy: filter.orderBy });

    const count = await this.repository.count(query.build());
    const queryResults = await this.repository.findAll(query.build());
    const mappedItems = queryResults.map((item) => {
      return {
        id: item.id,
        name: `${item.organization.name} (${item.address.province.name})`,
      };
    });

    return {
      result: mappedItems,
      total: count,
    };
  }
}
