import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'PersianDates', timestamps: false })
export class PersianDate extends Model {
  @Column({
    type: DataType.DATE,
    primaryKey: true,
  })
  GregorianDate: Date;
  @Column({
    type: DataType.STRING,
  })
  YearMonthDay: string;
  @Column({
    type: DataType.STRING,
  })
  YearMonth: string;
  @Column({
    type: DataType.STRING,
  })
  WeekDayName: string;
  @Column({
    type: DataType.INTEGER,
  })
  WeekDayNumber: number;
  @Column({
    type: DataType.INTEGER,
  })
  DayInMonth: number;
  @Column({
    type: DataType.STRING,
  })
  DayInMonthAtLeastTwo: string;
  @Column({
    type: DataType.INTEGER,
  })
  MonthNumber: number;
  @Column({
    type: DataType.STRING,
  })
  MonthNumberAtLeastTwo: string;
  @Column({
    type: DataType.STRING,
  })
  PersianMonthName: string;
  @Column({
    type: DataType.INTEGER,
  })
  YearNumber: number;
  @Column({
    type: DataType.INTEGER,
  })
  DayInYearNumber: number;
  @Column({
    type: DataType.STRING,
  })
  DayNameInMonth: string;
  @Column({
    type: DataType.STRING,
  })
  DayNameInYear: string;
}
