import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECSlugVersionType } from './ec-slug-version-type.entity';
@Table({ tableName: 'ECSlugVersions' })
export class ECSlugVersion extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.STRING,
  })
  slug: string;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECSlugVersionType)
  slugVersionTypeId: number;

  @BelongsTo(() => ECSlugVersionType, {
    as: 'slugVersionType',
    foreignKey: 'slugVersionTypeId',
  })
  slugVersionType?: ECSlugVersionType;

  @Column({
    type: DataType.BIGINT,
  })
  entityId: bigint;
}
