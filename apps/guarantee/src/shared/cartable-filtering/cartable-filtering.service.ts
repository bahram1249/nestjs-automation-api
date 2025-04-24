import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrganizationUserService } from '@rahino/bpmn/modules/organization-user/organization-user.service';

import { User } from '@rahino/database';
import {
  BPMNActivity,
  BPMNNode,
  BPMNNodeCommand,
  BPMNNodeCommandType,
  BPMNRequestState,
  GSAddress,
  GSBrand,
  GSCity,
  GSGuarantee,
  GSNeighborhood,
  GSProductType,
  GSProvince,
  GSRequest,
  GSRequestCategory,
  GSRequestType,
  GSVariant,
} from '@rahino/localdatabase/models';
import { CartableFindAllWithFilter, GetCartableDto } from './dto';
import { Op, WhereOptions } from 'sequelize';
import { RoleService } from '@rahino/core/user/role/role.service';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ActivityTypeEnum } from '@rahino/bpmn/modules/activity-type';

@Injectable()
export class SharedCartableFilteringService {
  constructor(
    @InjectModel(BPMNRequestState)
    private readonly repository: typeof BPMNRequestState,
    private readonly roleService: RoleService,
    private readonly organizationUserService: OrganizationUserService,
  ) {}

  async findAllForCurrentUser(user: User, filter: GetCartableDto) {
    const roleIds = await this.roleService.findAllRoleId(user.id);
    const organizationUsers =
      await this.organizationUserService.findAllOrganizationRole(user.id);

    const currentStateFilter: WhereOptions<any> = {
      [Op.or]: [
        {
          userId: user.id,
        },
        {
          [Op.and]: [
            {
              roleId: {
                [Op.in]: roleIds,
              },
            },
            {
              organizationId: {
                [Op.is]: null,
              },
            },
          ],
        },
        {
          [Op.or]: organizationUsers.map((organizationUser) => ({
            [Op.and]: [
              {
                roleId: organizationUser.roleId,
                organizationId: organizationUser.organizationId,
              },
            ],
          })),
        },
      ],
    };

    const customFilter = filter as CartableFindAllWithFilter;
    customFilter.cartableCurrentStateFilter = currentStateFilter;

    customFilter.cartableActivityFilter = {
      activityTypeId: filter.isClientSideCartable
        ? ActivityTypeEnum.ClientState
        : ActivityTypeEnum.SimpleState,
      isEndActivity: false,
    };

    return this.findAllWithFilter(customFilter);
  }

  private async findAllWithFilter(filter: CartableFindAllWithFilter) {
    let query = new QueryOptionsBuilder()
      .include([
        {
          attributes: ['id', 'name'],
          model: BPMNActivity,
          as: 'activity',
          required: true,
          where: filter.cartableActivityFilter,
        },
      ])
      .thenInclude({
        attributes: [
          'id',
          'requestTypeId',
          'requestCategoryId',
          'brandId',
          'variantId',
          'productTypeId',
          'userId',
          'guaranteeId',
          'phoneNumber',
          'addressId',
        ],
        model: GSRequest,
        as: 'guaranteeRequest',
        required: true,
        include: [
          {
            attributes: ['id', 'title'],
            model: GSRequestType,
            as: 'requestType',
          },
          {
            attributes: ['id', 'title'],
            model: GSRequestCategory,
            as: 'requestCategory',
          },
          {
            attributes: ['id', 'title'],
            model: GSBrand,
            as: 'brand',
          },
          {
            attributes: ['id', 'title'],
            model: GSVariant,
            as: 'variant',
          },
          {
            attributes: ['id', 'title'],
            model: GSProductType,
            as: 'productType',
          },
          {
            attributes: ['id', 'firstname', 'lastname', 'nationalCode'],
            model: User,
            as: 'user',
            required: true,
          },
          {
            attributes: ['id', 'guaranteePeriodId', 'serialNumber'],
            model: GSGuarantee,
            as: 'guarantee',
          },
          {
            attributes: [
              'id',
              'name',
              'latitude',
              'longitude',
              'provinceId',
              'cityId',
              'neighborhoodId',
              'street',
              'alley',
              'plaque',
              'floorNumber',
              'postalCode',
            ],
            model: GSAddress,
            as: 'address',
            include: [
              {
                attributes: ['id', 'name'],
                model: GSProvince,
                as: 'province',
                required: false,
              },
              {
                attributes: ['id', 'name'],
                model: GSCity,
                as: 'city',
                required: false,
              },
              {
                attributes: ['id', 'name'],
                model: GSNeighborhood,
                as: 'neighborhood',
                required: false,
              },
            ],
          },
        ],
      })
      .filterIf(
        filter.cartableCurrentStateFilter != null,
        filter.cartableCurrentStateFilter,
      )
      .filterIf(filter.nationalCode != null, {
        '$guaranteeRequest.user.nationalCode$': filter.nationalCode,
      })
      .filterIf(filter.phoneNumber != null, {
        '$guaranteeRequest.user.phoneNumber$': filter.phoneNumber,
      })
      .filterIf(filter.firstname != null, {
        '$guaranteeRequest.user.firstname$': filter.firstname,
      })
      .filterIf(filter.lastname != null, {
        '$guaranteeRequest.user.lastname$': filter.lastname,
      })
      .filterIf(filter.requestTypeId != null, {
        '$guaranteeRequest.requestTypeId$': filter.requestTypeId,
      })
      .filterIf(filter.requestId != null, { requestId: filter.requestId })
      .filterIf(filter.requestStateId != null, { id: filter.requestStateId });

    const count = await this.repository.count(query.build());

    query = query
      .attributes(['id', 'requestId', 'activityId', 'createdAt', 'updatedAt'])

      .thenInclude({
        attributes: ['id', 'injectForm', 'name', 'description'],
        model: BPMNNode,
        as: 'nodes',
        required: false,
        include: [
          {
            attributes: ['id', 'name', 'nodeCommandTypeId', 'route'],
            model: BPMNNodeCommand,
            as: 'nodeCommands',
            required: false,
            where: {
              isDeleted: {
                [Op.is]: null,
              },
            },
            include: [
              {
                attributes: ['id', 'name', 'commandColor'],
                model: BPMNNodeCommandType,
                as: 'nodeCommandType',
                required: false,
              },
            ],
          },
        ],
      })
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());

    return {
      result: results,
      total: count,
    };
  }
}
