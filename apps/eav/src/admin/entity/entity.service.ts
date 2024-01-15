import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EAVEntity } from '@rahino/database/models/eav/eav-entity.entity';
import { EntityDto } from './dto';

@Injectable()
export class EntityService {
  constructor(@InjectModel(EAVEntity) private repository: typeof EAVEntity) {}
  async create(dto: EntityDto) {
    const entity = await this.repository.create({
      entityTypeId: dto.entityTypeId,
    });
    return {
      result: entity,
    };
  }
}
