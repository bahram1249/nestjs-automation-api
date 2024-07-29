import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { UserRole } from './userRole.entity';
import { Attachment } from './attachment.entity';
import { Role } from './role.entity';
import { AutoMap } from 'automapper-classes';
//import { AutoMap } from '@automapper/classes';

@Table
export class User extends Model {
  // generateAuthToken() {
  //   return jwt.sign(
  //     { userId: this.id },
  //     config.get("jwt.privateKeyAuthToken")
  //   );
  // }

  // static associate(models: any){
  //   console.log("associate")
  //   User.hasMany(models.UserRole, { as: "userRoles", foreignKey: "userId" });
  // }
  async validPasswordAsync(password): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.BIGINT,
  })
  id: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @AutoMap()
  firstname: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @AutoMap()
  lastname: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @AutoMap()
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    set(value: string) {
      if (value) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(value, salt);
        this.setDataValue('password', hashedPassword);
      }
    },
  })
  password: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  mustChangePassword: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastPasswordChangeDate: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  static_id: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birthDate?: Date;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  profilePhotoAttachmentId?: bigint;
  @BelongsTo(() => Attachment, {
    as: 'profileAttachment',
    foreignKey: 'profilePhotoAttachmentId',
  })
  profileAttachment?: Attachment;
  @HasMany(() => UserRole)
  userRoles: UserRole[];
  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];
}
