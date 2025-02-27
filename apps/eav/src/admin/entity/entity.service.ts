import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EAVEntity } from '@rahino/localdatabase/models';
import { EntityDto } from './dto';
import { Transaction } from 'sequelize';

@Injectable()
export class EntityService {
  constructor(@InjectModel(EAVEntity) private repository: typeof EAVEntity) {}
  async create(dto: EntityDto, transaction: Transaction) {
    const entity = await this.repository.create(
      {
        entityTypeId: dto.entityTypeId,
      },
      {
        transaction,
      },
    );
    return {
      result: entity,
    };
  }
}
