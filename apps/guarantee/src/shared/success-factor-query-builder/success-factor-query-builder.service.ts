import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  GSFactor,
  GSFactorAdditionalPackage,
} from '@rahino/localdatabase/models';
import { GSSuccessFactorQueryBuilderDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GSFactorStatusEnum } from '../factor-status';

@Injectable()
export class GSSuccessFactorQueryBuilderService {
  constructor(
    @InjectModel(GSFactor) private readonly factorRepository: typeof GSFactor,
  ) {}

  // async findMyFactor(dto: GSSuccessFactorQueryBuilderDto) {
  //   let query = new QueryOptionsBuilder()
  //     .filter({ userId: dto.userId })
  //     .filter({ factorStatusId: GSFactorStatusEnum.Paid });

  //   const count = await this.factorRepository.count(query.build());

  //   query = query
  //     .include([{ model: GSFactorAdditionalPackage, as: '', required: false }])
  //     .offset(dto.offset)
  //     .limit(dto.limit)
  //     .order({ orderBy: dto.orderBy, sortOrder: dto.sortOrder });

  //   const results = await this.factorRepository.findAll(query.build());

  //   return {
  //     result: results,
  //     total: count,
  //   };
  // }
}
