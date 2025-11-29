import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { GSGuaranteeTypeEnum } from '@rahino/guarantee/shared/gurantee-type';
import {
  GSGuarantee,
  GSGuaranteeOrganization,
  GSRequest,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';

@Injectable()
export class AnonymousPublicReportService {
  constructor(
    @InjectModel(GSGuaranteeOrganization)
    private readonly guaranteeOrganizationRepository: typeof GSGuaranteeOrganization,
    @InjectModel(GSRequest)
    private readonly requestRepository: typeof GSRequest,
    @InjectModel(GSGuarantee)
    private readonly guaranteeRepository: typeof GSGuarantee,
    @InjectModel(User)
    private readonly userRepository: typeof User,
  ) {}

  async findAll() {
    const activeOrganizationQuery = new QueryOptionsBuilder()
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

    const requestQuery = new QueryOptionsBuilder().filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('GSRequest.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );

    const guaranteeQuery = new QueryOptionsBuilder().filter({
      guaranteeTypeId: GSGuaranteeTypeEnum.Normal,
    });

    const totalRequestPromise = this.requestRepository.count(
      requestQuery.build(),
    );

    const activeOrganizationPromise =
      await this.guaranteeOrganizationRepository.count(
        activeOrganizationQuery.build(),
      );

    const guaranteePromise = this.guaranteeRepository.count(
      guaranteeQuery.build(),
    );

    const userPromise = this.userRepository.count();

    const results = await Promise.all([
      totalRequestPromise,
      activeOrganizationPromise,
      guaranteePromise,
      userPromise,
    ]);

    const totalRequestCount = results[0];
    const activeOrganizationCount = results[1];
    const guaranteeCount = results[2];
    const userCount = results[3];

    return {
      result: {
        activeOrganizationCount: activeOrganizationCount,
        totalRequestCount: totalRequestCount,
        guaranteeCount: guaranteeCount,
        userCount: userCount,
      },
    };
  }
}
