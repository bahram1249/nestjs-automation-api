import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetOrganizationDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNActivity,
  BPMNOrganization,
  BPMNRequestState,
  GSAddress,
  GSCity,
  GSGuaranteeOrganization,
  GSProvince,
  GSRequest,
  GSResponse,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { User } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class AnonymousOrganizationService {
  constructor(
    @InjectModel(GSGuaranteeOrganization)
    private readonly repository: typeof GSGuaranteeOrganization,
    private readonly localizationService: LocalizationService,

    @InjectModel(BPMNRequestState)
    private readonly requestStateRepository: typeof BPMNRequestState,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    @InjectModel(GSResponse)
    private readonly responseRepository: typeof GSResponse,
  ) {}

  async findAll(filter: GetOrganizationDto) {
    const query = new QueryOptionsBuilder()
      .include([
        {
          attributes: ['id', 'provinceId', 'cityId', 'latitude', 'longitude'],
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
      .thenInclude({
        attributes: ['id', 'firstname', 'lastname'],
        model: User,
        as: 'user',
      })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('GSGuaranteeOrganization.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filterIf(filter.provinceId != null, {
        '$address.provinceId$': filter.provinceId,
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
        name: item.organization.name,
        provinceName: item.address.province.name,
        cityName: item.address?.city?.name,
        code: item.code ?? null,
        fullName: item.user.firstname + ' ' + item.user.lastname,
        latitude: item.address.latitude,
        longitude: item.address.longitude,
      };
    });

    return {
      result: mappedItems,
      total: count,
    };
  }

  async findById(entityId: number) {
    const query = new QueryOptionsBuilder()
      .attributes(['id', 'licenseDate', 'code', 'addressId'])
      .include([
        {
          attributes: ['id', 'provinceId', 'cityId', 'latitude', 'longitude'],
          model: GSAddress,
          as: 'address',
          required: true,
          include: [
            {
              attributes: ['id', 'name'],
              model: GSProvince,
              as: 'province',
              required: true,
            },
            {
              attributes: ['id', 'name'],
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
      })
      .thenInclude({
        attributes: ['id', 'firstname', 'lastname'],
        model: User,
        as: 'user',
      })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('GSGuaranteeOrganization.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({ id: entityId })
      .filter(
        Sequelize.literal(
          `EXISTS (
        SELECT 1
        FROM GSGuaranteeOrganizationContracts GGOC
        WHERE GGOC.organizationId = GSGuaranteeOrganization.id
        AND GETDATE() BETWEEN GGOC.startDate AND GGOC.endDate
      )`.replaceAll(/\s\s+/g, ' '),
        ),
      );

    const result = await this.repository.findOne(query.build());

    if (!result) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found'),
      );
    }

    const totalRequestCount = await this.requestRepository.count(
      new QueryOptionsBuilder()
        .filter({ organizationId: result.id })
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

    const finishedRequestQuery = new QueryOptionsBuilder()
      .include([
        {
          model: GSRequest,
          as: 'guaranteeRequest',
          required: true,
        },
        {
          model: BPMNActivity,
          as: 'activity',
          required: true,
        },
      ])
      .filter({ '$guaranteeRequest.organizationId$': result.id })
      .filter({ '$activity.isEndActivity$': true });

    const finishedRequestCount = await this.requestStateRepository.count(
      finishedRequestQuery.build(),
    );

    const responseQuery = new QueryOptionsBuilder()
      .attributes([
        [
          Sequelize.literal(`
        ISNULL(AVG(([totalScore] / [fromScore]) * 100) , 0)
        `),
          'averageScore',
        ],
      ])
      .include([
        {
          attributes: [],
          model: GSRequest,
          as: 'request',
          required: true,
        },
      ])
      .filter({ '$request.organizationId$': result.id })
      .raw(true);

    const queryOptions = responseQuery.build();
    queryOptions.limit = undefined;
    queryOptions.offset = undefined;
    queryOptions.order = [];

    const surveyPoint = await this.responseRepository.findAll(queryOptions);

    return {
      result: {
        organization: result,
        totalRequestCount: totalRequestCount,
        finishedRequestCount: finishedRequestCount,
        averageScore: surveyPoint[0]['averageScore'],
      },
    };
  }
}
