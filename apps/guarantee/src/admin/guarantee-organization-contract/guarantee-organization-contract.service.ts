import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNOrganization,
  GSGuaranteeOrganizationContract,
} from '@rahino/localdatabase/models';
import {
  GetGuaranteeOrganizationContractDto,
  GuaranteeOrganizationContractDto,
} from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { LocalizationService } from 'apps/main/src/common/localization';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';

@Injectable()
export class GuaranteeOrganizationContractService {
  constructor(
    @InjectModel(GSGuaranteeOrganizationContract)
    private readonly repository: typeof GSGuaranteeOrganizationContract,
    private readonly localizationService: LocalizationService,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async findAll(filter: GetGuaranteeOrganizationContractDto) {
    let query = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('GSGuaranteeOrganizationContract.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({ organizationId: filter.organizationId });

    // count
    const count = await this.repository.count(query.build());

    // extends query
    query = query
      .attributes([
        'id',
        'organizationId',
        'startDate',
        'endDate',
        'representativeShare',
        'createdAt',
        'updatedAt',
      ])
      .include({
        model: BPMNOrganization,
        as: 'bpmnOrganization',
        required: false,
        attributes: ['id', 'name'],
      })
      .order({ sortOrder: filter.sortOrder, orderBy: filter.orderBy })
      .offset(filter.offset)
      .limit(filter.limit);

    return {
      result: await this.repository.findAll(query.build()),
      total: count,
    };
  }

  async findById(entityId: bigint) {
    const query = new QueryOptionsBuilder()
      .attributes([
        'id',
        'organizationId',
        'startDate',
        'endDate',
        'representativeShare',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          model: BPMNOrganization,
          as: 'bpmnOrganization',
          attributes: ['id', 'name'],
          required: true,
        },
      ])
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('GSGuaranteeOrganizationContract.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({ id: entityId });

    const item = await this.repository.findOne(query.build());
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found'),
      );
    }
    return {
      result: item,
    };
  }

  async create(dto: GuaranteeOrganizationContractDto) {
    const startDate = new Date(dto.startDate).toISOString().slice(0, 10);
    const endDate = new Date(dto.endDate).toISOString().slice(0, 10);
    const findAnyContractBefore = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ organizationId: dto.organizationId })
        .filter({
          [Op.or]: [
            Sequelize.where(Sequelize.literal(`'${startDate}'`), {
              [Op.between]: [
                Sequelize.col('GSGuaranteeOrganizationContract.startDate'),
                Sequelize.col('GSGuaranteeOrganizationContract.endDate'),
              ],
            }),
            Sequelize.where(Sequelize.literal(`'${endDate}'`), {
              [Op.between]: [
                Sequelize.col('GSGuaranteeOrganizationContract.startDate'),
                Sequelize.col('GSGuaranteeOrganizationContract.endDate'),
              ],
            }),
          ],
        })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSGuaranteeOrganizationContract.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (findAnyContractBefore) {
      throw new BadRequestException(
        this.localizationService.translate(
          'bpmn.find_any_contract_in_this_given_date_before',
        ),
      );
    }
    const mappedItem = {
      organizationId: dto.organizationId,
      representativeShare: dto.representativeShare,
      startDate: startDate,
      endDate: endDate,
    };
    const item = await this.repository.create(mappedItem);
    return await this.findById(item.id);
  }

  async updateById(id: bigint, dto: GuaranteeOrganizationContractDto) {
    const startDate = new Date(dto.startDate).toISOString().slice(0, 10);
    const endDate = new Date(dto.endDate).toISOString().slice(0, 10);
    const findAnyContractBefore = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ organizationId: dto.organizationId })
        .filter({
          [Op.or]: [
            Sequelize.where(Sequelize.literal(`'${startDate}'`), {
              [Op.between]: [
                Sequelize.col('GSGuaranteeOrganizationContract.startDate'),
                Sequelize.col('GSGuaranteeOrganizationContract.endDate'),
              ],
            }),
            Sequelize.where(Sequelize.literal(`'${endDate}'`), {
              [Op.between]: [
                Sequelize.col('GSGuaranteeOrganizationContract.startDate'),
                Sequelize.col('GSGuaranteeOrganizationContract.endDate'),
              ],
            }),
          ],
        })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSGuaranteeOrganizationContract.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          id: {
            [Op.ne]: id,
          },
        })
        .build(),
    );
    if (findAnyContractBefore) {
      throw new BadRequestException(
        this.localizationService.translate(
          'bpmn.find_any_contract_in_this_given_date_before',
        ),
      );
    }

    const mappedItem = {
      organizationId: dto.organizationId,
      representativeShare: dto.representativeShare,
      startDate: startDate,
      endDate: endDate,
    };
    const item = await this.repository.update(mappedItem, {
      where: {
        id: id,
      },
    });

    return await this.findById(id);
  }

  async deleteById(entityId: bigint) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSGuaranteeOrganizationContract.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }
    item.isDeleted = true;
    await item.save();
    return {
      result: _.pick(item, [
        'id',
        'organizationId',
        'startDate',
        'endDate',
        'representativeShare',
        'createdAt',
        'updatedAt',
      ]),
    };
  }
}
