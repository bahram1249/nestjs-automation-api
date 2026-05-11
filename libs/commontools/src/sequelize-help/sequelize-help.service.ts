import { Injectable, NotImplementedException, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dialect, Sequelize } from 'sequelize';
import { Fn, Where } from 'sequelize/types/utils';
import { IsNullSymbol } from './enum';
import { Op } from 'sequelize';

@Injectable({ scope: Scope.DEFAULT })
export class SequelizeHelpService {
  private _isnullKey: string;
  constructor(config: ConfigService) {
    const configDialect = config.get('DB_DIALECT') || 'mssql';
    const dialect = configDialect as Dialect;
    this._isnullKey = this.prepareNullKey(dialect);
  }

  whereIsNullColumnNotEqualToValue(
    columnName: string,
    defaultColumnValue: any,
    value: any,
  ): Where {
    return Sequelize.where(this.isnullColumn(columnName, defaultColumnValue), {
      [Op.ne]: value,
    });
  }

  whereIsNullColumnEqualToValue(
    columnName: string,
    defaultColumnValue: any,
    value: any,
  ): Where {
    return Sequelize.where(this.isnullColumn(columnName, defaultColumnValue), {
      [Op.eq]: value,
    });
  }

  whereIsNullColumnEqualToZero(
    columnName: string,
    defaultColumnValue: any,
  ): Where {
    return Sequelize.where(this.isnullColumn(columnName, defaultColumnValue), {
      [Op.eq]: 0,
    });
  }

  whereIsNullColumnNotEqualToZero(
    columnName: string,
    defaultColumnValue: any,
  ): Where {
    return Sequelize.where(this.isnullColumn(columnName, defaultColumnValue), {
      [Op.ne]: 0,
    });
  }

  isnullColumn(columnName: string, defaultColumnValue: any): Fn {
    return this.isnullGlobal(Sequelize.col(columnName), defaultColumnValue);
  }

  private isnullGlobal(...args: unknown[]): Fn {
    return Sequelize.fn(this._isnullKey, args);
  }

  private prepareNullKey(dialect: Dialect): string {
    switch (dialect) {
      case 'mssql':
        return IsNullSymbol.mssql;
      case 'postgres':
        return IsNullSymbol.postgres;
      case 'sqlite':
        return IsNullSymbol.sqlite;
      default:
        throw new NotImplementedException('dialect not implemented!');
    }
  }
}
