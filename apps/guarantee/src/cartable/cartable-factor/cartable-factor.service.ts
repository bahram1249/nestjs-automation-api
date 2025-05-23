import { Injectable, NotFoundException } from '@nestjs/common';
import { GetFactorDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSFactor } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { GSSuccessFactorQueryBuilderService } from '@rahino/guarantee/shared/success-factor-query-builder';
import { GSSuccessFactorQueryBuilderMapper } from '@rahino/guarantee/shared/success-factor-query-builder/success-factor-query-builder.mapper';
import { LocalizationService } from 'apps/main/src/common/localization';
import { OrganizationStuffService } from '@rahino/guarantee/shared/organization-stuff';
import { RoleService } from '@rahino/core/user/role/role.service';
import { GuaranteeStaticRoleEnum } from '@rahino/guarantee/shared/static-role/enum';

@Injectable()
export class FactorService {
  private readonly superAdminStaticId = 1;
  constructor(
    @InjectModel(GSFactor) private repository: typeof GSFactor,
    private readonly factorQueryBuilder: GSSuccessFactorQueryBuilderService,
    private readonly factorMapper: GSSuccessFactorQueryBuilderMapper,
    private readonly localizationService: LocalizationService,
    private readonly organizationStuffService: OrganizationStuffService,
    private readonly roleService: RoleService,
  ) {}

  async findAll(user: User, filter: GetFactorDto) {
    // supervisor role show all
    const hasSuperVisorRole = await this.roleService.isAccessToStaticRole(
      user.id,
      GuaranteeStaticRoleEnum.SupervisorRole,
    );

    // admin role show all
    const hasAdminRole = await this.roleService.isAccessToStaticRole(
      user.id,
      this.superAdminStaticId,
    );

    const organizationId =
      await this.organizationStuffService.getOptionalOrganizationIdByUserId(
        user.id,
      );

    let query = this.factorQueryBuilder
      .init()
      .cartableFilter({
        userId: user.id,
        organizationId: organizationId,
        showTotal: hasAdminRole || hasSuperVisorRole,
      })
      .filterFactorId(filter.factorId)
      .dateGreaterThan(filter.greaterThan)
      .dateLessThan(filter.lessThan);
    const count = await this.repository.count(query.build());

    query = query
      .requiredIncluded()
      .requiredAttributes()
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
    const organizationId =
      await this.organizationStuffService.getOptionalOrganizationIdByUserId(
        user.id,
      );

    let query = this.factorQueryBuilder
      .init()
      .cartableFilter({ userId: user.id, organizationId: organizationId })
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
