import { Column, Model, Table } from 'sequelize-typescript';

/// imports
@Table({ tableName: 'Users' })
export class Users extends Model<Users> {
  @Column({ allowNull: false })
  firstName: string;
  @Column({ allowNull: false })
  lastName: string;
  @Column({ allowNull: false, unique: true })
  email: string;
  @Column({ allowNull: false })
  password: string;

  @Column({ allowNull: false })
  type: string;
}
