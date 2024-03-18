import { DynamicModule, Module } from '@nestjs/common';
import * as DataTypes from 'sequelize/lib/data-types';

@Module({})
export class SequelizeOverrideModule {
  static override(): DynamicModule {
    DataTypes.DATE.prototype._stringify = function _stringify(date, options) {
      date = this._applyTimezone(date, options);
      return date.format('YYYY-MM-DD HH:mm:ss.SSS');
    };
    return {
      module: SequelizeOverrideModule,
    };
  }
}
