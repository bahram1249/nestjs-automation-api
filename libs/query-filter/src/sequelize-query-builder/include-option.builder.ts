import { isNotNull } from '@rahino/commontools';
import {
  FindAttributeOptions,
  IncludeOptions,
  Includeable,
  Op,
  WhereOptions,
} from 'sequelize';
import { ModelType } from 'sequelize-typescript';

export class IncludeOptionsBuilder {
  private options: IncludeOptions;
  constructor(
    includeOptionsBuilderInit: IncludeOptions,
    //   {
    //   model: ModelType<any, any>;
    //   as: string;
    //   required?: boolean;
    // }
  ) {
    this.options = includeOptionsBuilderInit;
    if (this.options.where == null) this.options.where = { [Op.and]: [] };
    // this.options = {
    //   model: includeOptionsBuilderInit.model,
    //   as: includeOptionsBuilderInit.as,
    //   required: includeOptionsBuilderInit.required,
    //   where: {
    //     [Op.and]: [],
    //   },
    // };
    return this;
  }
  include(include: Includeable[]): IncludeOptionsBuilder {
    this.options.include = include;
    return this;
  }
  filter(condition: WhereOptions<any>): IncludeOptionsBuilder {
    this.options.where[Op.and].push(condition);
    return this;
  }

  filterIf(
    condition: boolean,
    queryCondition: WhereOptions<any>,
  ): IncludeOptionsBuilder {
    if (condition) this.options.where[Op.and].push(queryCondition);
    return this;
  }
  attributes(attributes: FindAttributeOptions): IncludeOptionsBuilder {
    this.options.attributes = attributes;
    return this;
  }
  subQuery(flag: boolean): IncludeOptionsBuilder {
    this.options.subQuery = flag;
    return this;
  }
  thenInclude(include: Includeable): IncludeOptionsBuilder {
    let included = this.options.include as Includeable[];
    if(isNotNull(included)) included = [];
    included.push(include);
    return this;
  }
  build(): IncludeOptions {
    return this.options;
  }
}

function isOrderCol(x: any) {
  return 'orderBy' in x;
}
