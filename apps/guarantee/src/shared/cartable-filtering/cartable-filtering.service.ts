import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrganizationUserService } from '@rahino/bpmn/modules/organization-user/organization-user.service';

import { Role, User, UserRole, UserType } from '@rahino/database';
import {
  BPMNActivity,
  BPMNNode,
  BPMNNodeCommand,
  BPMNNodeCommandType,
  BPMNOrganization,
  BPMNOrganizationUser,
  BPMNRequestState,
  GSAdditionalPackage,
  GSAddress,
  GSAssignedGuarantee,
  GSBrand,
  GSCity,
  GSGuarantee,
  GSNeighborhood,
  GSProductType,
  GSProvince,
  GSRequest,
  GSRequestCategory,
  GSRequestItem,
  GSRequestItemType,
  GSRequestType,
  GSShippingWay,
  GSVariant,
} from '@rahino/localdatabase/models';
import {
  CartableFindAllWithFilter,
  GetCartableDto,
  RequestCurrentStateFilterDto,
  RequestCurrentStateOutputDto,
  RequestCurrentStateUserOutputDto,
} from './dto';
import { Op, Sequelize, WhereOptions } from 'sequelize';
import { RoleService } from '@rahino/core/user/role/role.service';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ActivityTypeEnum } from '@rahino/bpmn/modules/activity-type';
import { GuaranteeStaticRoleEnum } from '../static-role/enum';

@Injectable()
export class SharedCartableFilteringService {
  private readonly superAdminStaticId = 1;
  constructor(
    @InjectModel(BPMNRequestState)
    private readonly repository: typeof BPMNRequestState,
    @InjectModel(BPMNOrganizationUser)
    private readonly organizationUserRepository: typeof BPMNOrganizationUser,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
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
    customFilter.includeNodeFilter = true;

    customFilter.cartableActivityFilter = {
      activityTypeId: filter.isClientSideCartable
        ? ActivityTypeEnum.ClientState
        : ActivityTypeEnum.SimpleState,
      isEndActivity: false,
    };

    return this.findAllWithFilter(customFilter);
  }

  async findAllForTracking(user: User, filter: GetCartableDto) {
    // organization role with same request organization
    const organizationIds =
      await this.organizationUserService.findAllOrganizationWithOrganizationRole(
        user.id,
      );
    // supervisor role show all
    const hasSuperVisorRole = await this.roleService.isAccessToStaticRole(
      user.id,
      GuaranteeStaticRoleEnum.SupervisorRole,
    );

    const hasSuperVisorRoleNum = Number(hasSuperVisorRole);
    // admin role show all
    const hasAdminRole = await this.roleService.isAccessToStaticRole(
      user.id,
      this.superAdminStaticId,
    );
    const hasAdminRoleNum = Number(hasAdminRole);
    // once tracking in my cartable
    const trackingInCartable: WhereOptions<any> = Sequelize.literal(`EXISTS (
      SELECT 1
      FROM BPMNRequestHistories RH
      WHERE RH.requestId = BPMNRequestState.requestId
        AND RH.fromUserId = ${user.id}
      )`);
    const customFilter = filter as CartableFindAllWithFilter;

    customFilter.includeNodeFilter = false;

    customFilter.cartableTrackingRequestFilter = {
      [Op.or]: [
        {
          '$guaranteeRequest.organizationId$': {
            [Op.in]: organizationIds,
          },
        },
        Sequelize.literal(`CAST(${hasAdminRoleNum} AS bit) = 1`),
        Sequelize.literal(`CAST(${hasSuperVisorRoleNum} AS bit) = 1`),
        trackingInCartable,
      ],
    };
    return await this.findAllWithFilter(customFilter);
  }

  async findCurrentStates(
    user: User,
    filter: RequestCurrentStateFilterDto,
  ): Promise<RequestCurrentStateOutputDto[]> {
    const currentStates = await this.repository.findAll(
      new QueryOptionsBuilder()
        .include([{ model: BPMNActivity, as: 'activity' }])
        .thenInclude({
          model: User,
          as: 'user',
          attributes: ['id', 'firstname', 'lastname', 'phoneNumber'],
        })
        .thenInclude({ model: BPMNOrganization, as: 'organization' })
        .thenInclude({ model: Role, as: 'role' })
        .filter({ requestId: filter.requestId })
        .build(),
    );

    const states = currentStates.map(
      async (currentState): Promise<RequestCurrentStateOutputDto> => {
        const users: RequestCurrentStateUserOutputDto[] = [];
        if (currentState.userId != null) {
          users.push({
            id: currentState.user.id,
            firstname: currentState.user.firstname,
            lastname: currentState.user.lastname,
            phoneNumber: currentState.user.phoneNumber,
          });
        } else if (
          currentState.organizationId != null &&
          currentState.roleId != null
        ) {
          const organizationUsers =
            await this.organizationUserRepository.findAll(
              new QueryOptionsBuilder()
                .include([{ model: User, as: 'user' }])
                .filter({ organizationId: currentState.organizationId })
                .filter({ roleId: currentState.roleId })
                .build(),
            );
          users.push(
            ...organizationUsers.map(
              (organizationUser): RequestCurrentStateUserOutputDto => ({
                id: organizationUser.user.id,
                firstname: organizationUser.user.firstname,
                lastname: organizationUser.user.lastname,
                phoneNumber: organizationUser.user.phoneNumber,
              }),
            ),
          );
        } else if (currentState.roleId) {
          const userRoles = await this.userRoleRepository.findAll(
            new QueryOptionsBuilder()
              .include([{ model: User, as: 'user' }])
              .filter({ roleId: currentState.roleId })
              .build(),
          );

          users.push(
            ...userRoles.map(
              (userRole): RequestCurrentStateUserOutputDto => ({
                id: userRole.user.id,
                firstname: userRole.user.firstname,
                lastname: userRole.user.lastname,
                phoneNumber: userRole.user.phoneNumber,
              }),
            ),
          );
        }

        return {
          activityName: currentState.activity.name,
          users: users,
        };
      },
    );

    return await Promise.all(states);
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
          'clientShipmentWayId',
          'clientShipmentWayTrackingCode',
          'cartableShipmentWayId',
          'cartableShipmentWayTrackingCode',
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
            attributes: [
              'id',
              'firstname',
              'lastname',
              'nationalCode',
              'phoneNumber',
              'userTypeId',
            ],
            model: User,
            as: 'user',
            required: true,
            include: [{ model: UserType, as: 'userType', required: false }],
          },
          {
            attributes: ['id', 'title'],
            model: GSShippingWay,
            as: 'clientShipmentWay',
            required: false,
          },
          {
            attributes: ['id', 'title'],
            model: GSShippingWay,
            as: 'cartableShipmentWay',
            required: false,
          },
          {
            attributes: ['id', 'guaranteePeriodId', 'serialNumber'],
            model: GSGuarantee,
            as: 'guarantee',
            include: [
              {
                model: GSAssignedGuarantee,
                attributes: ['id', 'guaranteeId', 'userId'],
                include: [
                  {
                    model: GSAdditionalPackage,
                    through: {
                      attributes: [],
                    },
                    as: 'additionalPackages',
                    required: false,
                  },
                ],
                required: false,
                where: {
                  isDeleted: {
                    [Op.is]: null,
                  },
                },
              },
            ],
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
          {
            model: GSRequestItem,
            as: 'requestItems',
            required: false,
            include: [
              { model: User, as: 'user', required: false },
              { model: GSRequestItemType, as: 'requestItemType' },
            ],
          },
        ],
      })
      .filterIf(
        filter.cartableTrackingRequestFilter != null,
        filter.cartableTrackingRequestFilter,
      )
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
      .filterIf(filter.requestStateId != null, { id: filter.requestStateId })
      .filterIf(filter.activityId != null, { activityId: filter.activityId })
      .filterIf(filter.requestIds != null, { requestId: { [Op.in]: filter.requestIds } })
      .filterIf(
        filter.serialNumber != null,
        Sequelize.literal(
          `EXISTS (
            SELECT 1
            FROM GSRequests AS Req
            LEFT JOIN GSGuarantees G
            ON Req.guaranteeId = G.id
            WHERE [Req].id = BPMNRequestState.requestId
              AND [G].serialNumber LIKE N'%${filter.serialNumber}%') `.replaceAll(
            /\s\s+/g,
            ' ',
          ),
        ),
      );

    const count = await this.repository.count(query.build());

    query = query
      .attributes(['id', 'requestId', 'activityId', 'createdAt', 'updatedAt'])

      .thenIncludeIf(filter.includeNodeFilter, {
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
