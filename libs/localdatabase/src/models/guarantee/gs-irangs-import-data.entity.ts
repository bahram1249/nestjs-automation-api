import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '@rahino/database';
import { GSIrangsImportStatus } from './gs-irangs-import-status.entity';
import { GSGuarantee } from './gs-guarantee.entity';
import { GSIrangsImportDataGuarantees } from './gs-irangs-import-data-guarantees.entity';

@Table({ tableName: 'GSIrangsImportData' })
export class GSIrangsImportData extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: bigint;

  @Column({
    type: DataType.STRING,
  })
  fileName: string;

  @ForeignKey(() => GSIrangsImportStatus)
  @Column({
    type: DataType.INTEGER,
  })
  statusId: number;

  @BelongsTo(() => GSIrangsImportStatus, 'statusId')
  status?: GSIrangsImportStatus;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  totalRows: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  processedRows: number;

  @Column({
    type: DataType.TEXT,
  })
  error: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
  })
  userId: bigint;

  @BelongsTo(() => User, 'userId')
  user?: User;

  @BelongsToMany(
    () => GSGuarantee,
    () => GSIrangsImportDataGuarantees,
    'irangsImportDataId',
    'guaranteeId',
  )
  guarantees: GSGuarantee[];

  @Column({
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
  })
  updatedAt: Date;
}
