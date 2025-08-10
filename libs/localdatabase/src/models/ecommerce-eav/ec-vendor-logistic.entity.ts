import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ECVendor } from './ec-vendor.entity';
import { ECLogistic } from './ec-logistic.entity';

@Table({ tableName: 'ECVendorLogistics' })
export class ECVendorLogistic extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECVendor)
  vendorId: number;

  @BelongsTo(() => ECVendor, { as: 'vendor', foreignKey: 'vendorId' })
  vendor?: ECVendor;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECLogistic)
  logisticId: bigint;

  @BelongsTo(() => ECLogistic, { as: 'logistic', foreignKey: 'logisticId' })
  logistic?: ECLogistic;

  @AutoMap()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDefault?: boolean;
  @AutoMap()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
