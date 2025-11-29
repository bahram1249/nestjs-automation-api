import { Injectable, NotFoundException } from '@nestjs/common';
import { GetFactorDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSFactor } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { GSSuccessFactorQueryBuilderService } from '@rahino/guarantee/shared/success-factor-query-builder';
import { GSSuccessFactorQueryBuilderMapper } from '@rahino/guarantee/shared/success-factor-query-builder/success-factor-query-builder.mapper';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class FactorService {
  constructor(
    @InjectModel(GSFactor) private repository: typeof GSFactor,
    private readonly factorQueryBuilder: GSSuccessFactorQueryBuilderService,
    private readonly factorMapper: GSSuccessFactorQueryBuilderMapper,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(user: User, filter: GetFactorDto) {
    let query = this.factorQueryBuilder
      .init(false)
      .factorOwner(user.id)
      .dateGreaterThan(filter.greaterThan)
      .dateLessThan(filter.lessThan);
    const count = await this.repository.count(query.build());

    query = query
      .requiredIncluded()
      .requiredAttributes()
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .limit(filter.limit)
      .offset(filter.offset);

    const result = await this.repository.findAll(query.build());

    const mappedItems = this.factorMapper.mapItems(result);
    return {
      result: mappedItems,
      total: count,
    };
  }

  async findById(user: User, entityId: bigint) {
    const query = this.factorQueryBuilder
      .init(false)
      .factorOwner(user.id)
      .filterFactorId(entityId)
      .requiredIncluded()
      .requiredAttributes();

    const result = await this.repository.findOne(query.build());
    if (!result) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    const mappedItem = this.factorMapper.mapItem(result);

    return {
      result: mappedItem,
    };
  }
}
