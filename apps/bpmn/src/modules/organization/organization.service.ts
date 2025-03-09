import { Injectable } from '@nestjs/common';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import { OrganizationDto } from './dto';
import { Transaction } from 'sequelize';
import { BPMNOrganization } from '@rahino/localdatabase/models';
import { InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
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
}
