import { Injectable } from '@nestjs/common';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import { OrganizationDto } from './dto';
import { Transaction } from 'sequelize';
import { BPMNOrganization } from '@rahino/localdatabase/models';
import { InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
@Injectable()
export class OrganizationService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectModel(BPMNOrganization)
    private readonly repository: typeof BPMNOrganization,
  ) {}

  async create(
    dto: OrganizationDto,
    transaction?: Transaction,
  ): Promise<BPMNOrganization> {
    const mappedItem = this.mapper.map(dto, OrganizationDto, BPMNOrganization);
    return await this.repository.create(_.omit(mappedItem.toJSON(), ['id']), {
      transaction: transaction,
    });
  }

  async update(
    id: number,
    dto: OrganizationDto,
    transaction?: Transaction,
  ): Promise<BPMNOrganization> {
    const mappedItem = this.mapper.map(dto, OrganizationDto, BPMNOrganization);
    await this.repository.update(_.omit(mappedItem.toJSON(), ['id']), {
      transaction: transaction,
      where: {
        id: id,
      },
    });
    return this.findById(id, transaction);
  }

  async findById(
    id: number,
    transaction?: Transaction,
  ): Promise<BPMNOrganization> {
    return await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: id })
        .transaction(transaction)
        .build(),
    );
  }
}
