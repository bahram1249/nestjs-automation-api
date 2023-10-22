import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class AttachmentType extends Model {

  @Column({
    primaryKey: true
  })
  id: number;

  @Column({})
  typeName:string;
}