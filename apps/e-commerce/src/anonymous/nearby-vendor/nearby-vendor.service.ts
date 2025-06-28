import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import { ECCity, ECProvince, ECVendor } from '@rahino/localdatabase/models';
import { GetNearbyVendorDto, ValidAreaDto, VendorDistanceDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { Attachment } from '@rahino/database';
import { NEARBY_SHOPPING_KM } from '@rahino/ecommerce/shared/constants';

@Injectable()
export class NearbyVendorService {
  private readonly distanceMeters = NEARBY_SHOPPING_KM * 1000;

  constructor(
    @InjectModel(ECVendor) private repository: typeof ECVendor,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(dto: GetNearbyVendorDto) {
    const replacements = {
      longitude: dto.longitude,
      latitude: dto.latitude,
      distance: this.distanceMeters,
    };

    let queryBuilder = new QueryOptionsBuilder()
      .filter({
        coordinates: {
          [Op.not]: null,
        },
      })
      .filter(
        Sequelize.literal(
          `coordinates.STDistance(geography::Point(:latitude, :longitude, 4326)) <= :distance`,
        ),
      )
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECVendor.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )

      .replacements(replacements);

    const count = await this.repository.count(queryBuilder.build());

    queryBuilder = queryBuilder
      .attributes([
        'id',
        'name',
        'slug',
        'address',
        'priorityOrder',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'provinceId',
        'cityId',
        'latitude',
        'longitude',
      ])
      .include([
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: ECProvince,
          as: 'province',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: ECCity,
          as: 'city',
          required: false,
        },
      ])
      .order([
        Sequelize.literal(
          `coordinates.STDistance(geography::Point(:latitude, :longitude, 4326))`,
        ),
        'ASC',
      ])
      .limit(dto.limit)
      .offset(dto.offset);

    const result = await this.repository.findAll(queryBuilder.build());
    return {
      result: result,
      total: count,
    };
  }

  async inValidArea(dto: ValidAreaDto) {
    let inValidArea = false;
    const vendor = await this.getVendorWithDistance(
      dto.vendorId,
      dto.latitude,
      dto.longitude,
    );

    if (vendor.distanceInMeters <= this.distanceMeters) {
      inValidArea = true;
    }
    return {
      result: {
        inValidArea,
      },
    };
  }

  private async getVendorWithDistance(
    vendorId: number,
    latitude: string,
    longitude: string,
  ) {
    const vendors = await this.sequelize.query<VendorDistanceDto>(
      `SELECT 
        id, 
        name, 
        coordinates.STDistance(geography::Point(:latitude, :longitude, 4326)) AS distanceInMeters
       FROM ECVendors
       WHERE id = :vendorId`,
      {
        replacements: {
          latitude: Number(latitude),
          longitude: Number(longitude),
          vendorId,
        },
        type: QueryTypes.SELECT,
      },
    );
    return vendors[0];
  }
}
