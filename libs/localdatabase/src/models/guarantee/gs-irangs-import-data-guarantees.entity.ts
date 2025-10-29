import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { GSIrangsImportData } from './gs-irangs-import-data.entity';
import { GSGuarantee } from './gs-guarantee.entity';

@Table({ tableName: 'GSIrangsImportDataGuarantees' })
export class GSIrangsImportDataGuarantees extends Model {
  @ForeignKey(() => GSIrangsImportData)
  @Column({
    type: DataType.BIGINT,
  })
  irangsImportDataId: bigint;

  @ForeignKey(() => GSGuarantee)
  @Column({
    type: DataType.BIGINT,
  })
  guaranteeId: bigint;
}
