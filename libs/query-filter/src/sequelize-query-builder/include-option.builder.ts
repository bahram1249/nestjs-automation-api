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
    // ensure where exists and has an Op.and array to safely push filters later
    if (this.options.where == null) {
      this.options.where = { [Op.and]: [] } as any;
    } else {
      // if a plain where object was provided without [Op.and], initialize it
      const w = this.options.where as any;
      if (!w[Op.and]) w[Op.and] = [];
    }
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
    // guard against undefined where/and for robustness
    const w =
      (this.options.where as any) ||
      (this.options.where = { [Op.and]: [] } as any);
    if (!w[Op.and]) w[Op.and] = [];
    w[Op.and].push(condition);
    return this;
  }

  filterIf(
    condition: boolean,
    queryCondition: WhereOptions<any>,
  ): IncludeOptionsBuilder {
    if (condition) {
      const w =
        (this.options.where as any) ||
        (this.options.where = { [Op.and]: [] } as any);
      if (!w[Op.and]) w[Op.and] = [];
      w[Op.and].push(queryCondition);
    }
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
    if (!isNotNull(included)) included = [];
    included.push(include);
    this.options.include = included;
    return this;
  }
  build(): IncludeOptions {
    return this.options;
  }
}

function isOrderCol(x: any) {
  return 'orderBy' in x;
}
