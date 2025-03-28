import { Injectable } from '@nestjs/common';
import { GetCartableDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
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
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { ActivityTypeEnum } from '@rahino/bpmn/modules/activity-type';

@Injectable()
export class CartableService {
  constructor(
    @InjectModel(BPMNRequestState)
    private readonly repository: typeof BPMNRequestState,
  ) {}

  async findAll(user: User, filter: GetCartableDto) {
    let query = new QueryOptionsBuilder()
      .include([
        {
          attributes: ['id', 'name'],
          model: BPMNActivity,
          as: 'activity',
          required: true,
          where: {
            activityTypeId: ActivityTypeEnum.ClientState,
            isEndActivity: false,
          },
        },
      ])
      .filter({
        userId: user.id,
      })
      .filterIf(filter.requestId != null, { requestId: filter.requestId })
      .filterIf(filter.requestStateId != null, { id: filter.requestStateId });

    const count = await this.repository.count(query.build());

    query = query
      .attributes(['id', 'requestId', 'activityId', 'createdAt', 'updatedAt'])
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
        required: false,
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
            attributes: ['id', 'firstname', 'lastname'],
            model: User,
            as: 'user',
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
      .thenInclude({
        attributes: ['id', 'injectForm'],
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
