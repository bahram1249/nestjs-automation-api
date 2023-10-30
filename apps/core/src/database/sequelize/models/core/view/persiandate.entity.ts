import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

@Table({ tableName: 'persiandate' })
export class PersianDate extends Model {
  static associate(models) {
    // Attachment.belongsTo(models.AttachmentType, {
    //   foreignKey: 'attachmentTypeId',
    //   as: 'attachmentType',
    // });
    // Attachment.belongsTo(models.User, {
    //   foreignKey: 'userId',
    //   as: 'user',
    // });
  }

  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: false,
  })
  id: number;

  @Column({})
  name: string;
}
