import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'VW_BuffetReservers', timestamps: false })
export class VW_BuffetReservers extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.STRING,
  })
  title: string;
  @Column({
    type: DataType.BIGINT,
  })
  ownerId: bigint;
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  YearNumber: number;
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  MonthNumber: number;
  @Column({
    type: DataType.STRING,
  })
  PersianMonthName: string;
  @Column({
    type: DataType.DATE,
  })
  MinDate?: Date;
  @Column({
    type: DataType.DATE,
  })
  MaxDate?: Date;
  @Column({
    type: DataType.INTEGER,
  })
  totalCnt?: number;
  @Column({
    type: DataType.INTEGER,
  })
  onlineCnt?: number;
  @Column({
    type: DataType.INTEGER,
  })
  onlineScanCnt?: number;
  @Column({
    type: DataType.INTEGER,
  })
  offlineCnt?: number;
  @Column({
    type: DataType.INTEGER,
  })
  offlineScanCnt?: number;
  @Column({
    type: DataType.BIGINT,
  })
  onlineSumPrice?: bigint;

  @Column({
    type: DataType.BIGINT,
  })
  onlineSumPriceScaned?: bigint;

  @Column({
    type: DataType.BIGINT,
  })
  offlineSumPrice?: bigint;

  @Column({
    type: DataType.BIGINT,
  })
  offlineSumPriceScaned?: bigint;
}
