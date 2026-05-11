import { Injectable, NotImplementedException, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dialect, Sequelize } from 'sequelize';
import { Fn, Where, Literal } from 'sequelize/types/utils';
import { GetDateSymbol, IsNullSymbol } from './enum';
import { Op } from 'sequelize';

@Injectable({ scope: Scope.DEFAULT })
export class SequelizeHelpService {
  private _isnullKey: string;
  private _getdateKey: string;
  private readonly _dialect: string;
  constructor(config: ConfigService) {
    const configDialect = config.get('DB_DIALECT') || 'mssql';
    const dialect = configDialect as Dialect;
    this._dialect = configDialect;
    this._isnullKey = this.prepareNullKey(dialect);
    this._getdateKey = this.prepareDateKey(dialect);
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

  isnull(expression: any, defaultValue: any): Fn {
    return this.isnullGlobal(expression, defaultValue);
  }

  private isnullGlobal(...args: unknown[]): Fn {
    return Sequelize.fn(this._isnullKey, args);
  }

  getDate(): Fn {
    return Sequelize.fn(this._getdateKey);
  }

  whereCurrentDateLessThanColumn(columnName: string): Where {
    return Sequelize.where(this.getDate(), {
      [Op.lt]: Sequelize.col(columnName),
    });
  }

  whereCurrentDateGreaterThanColumn(columnName: string): Where {
    return Sequelize.where(this.getDate(), {
      [Op.gt]: Sequelize.col(columnName),
    });
  }

  sumColumn(columnName: string): Fn {
    return Sequelize.fn('SUM', Sequelize.col(columnName));
  }

  dateAdd(amount: number | any, unit: string, dateExpr?: any): any {
    const resolvedDate = dateExpr !== undefined ? dateExpr : this.getDate();
    switch (this._dialect) {
      case 'mssql':
        return Sequelize.fn(
          'DATEADD',
          Sequelize.literal(unit),
          amount,
          resolvedDate,
        );
      case 'postgres':
        return this.postgresDateAdd(amount, unit, resolvedDate);
      case 'sqlite':
        return this.sqliteDateAdd(amount, unit, resolvedDate);
      default:
        throw new NotImplementedException('dialect not implemented!');
    }
  }

  private postgresDateAdd(
    amount: number | any,
    unit: string,
    dateExpr: any,
  ): Literal {
    const amountStr = this.extractAmountValue(amount);
    const dateSql = this.stringifyExpr(dateExpr);
    return Sequelize.literal(`${dateSql} + INTERVAL '${amountStr} ${unit}s'`);
  }

  private sqliteDateAdd(amount: number | any, unit: string, dateExpr: any): Fn {
    const amountStr = this.extractAmountValue(amount);
    const signedAmount = amountStr.startsWith('-')
      ? amountStr
      : `+${amountStr}`;
    return Sequelize.fn(
      'datetime',
      dateExpr,
      Sequelize.literal(`'${signedAmount} ${unit}s'`),
    );
  }

  private extractAmountValue(amount: number | any): string {
    if (typeof amount === 'number') return String(amount);
    if (typeof amount === 'object' && amount !== null && 'val' in amount)
      return String((amount as any).val);
    return String(amount);
  }

  private stringifyExpr(expr: any): string {
    if (expr === null || expr === undefined) return 'NULL';
    if (typeof expr === 'string') return `'${expr.replace(/'/g, "''")}'`;
    if (typeof expr === 'number' || typeof expr === 'boolean')
      return String(expr);
    if (typeof expr === 'object') {
      if ('fn' in expr) {
        const fn = expr as any;
        const fnName =
          (this._dialect === 'postgres' || this._dialect === 'sqlite') &&
          fn.fn.toUpperCase() === 'GETDATE'
            ? 'NOW'
            : fn.fn;
        const args = (fn.args || [])
          .map((a: any) => this.stringifyExpr(a))
          .join(', ');
        return `${fnName}(${args})`;
      }
      if ('col' in expr) {
        const colName = (expr as any).col;
        if (this._dialect === 'postgres') {
          const parts = colName.split('.');
          return parts.map((p: string) => `"${p}"`).join('.');
        }
        return colName;
      }
      if ('val' in expr) {
        return (expr as any).val;
      }
    }
    return String(expr);
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

  private prepareDateKey(dialect: Dialect): string {
    switch (dialect) {
      case 'mssql':
        return GetDateSymbol.mssql;
      case 'postgres':
        return GetDateSymbol.postgres;
      case 'sqlite':
        return GetDateSymbol.sqlite;
      default:
        throw new NotImplementedException('dialect not implemented!');
    }
  }
}
