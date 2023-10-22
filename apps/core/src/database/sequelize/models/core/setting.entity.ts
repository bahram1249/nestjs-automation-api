import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Setting extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({})
  key: string;
  value: string;
  type: string;
}
