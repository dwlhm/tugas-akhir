import {
  Table,
  Column,
  Model,
  BelongsTo,
  Default,
  ForeignKey,
  AllowNull,
  PrimaryKey,
  Unique,
  HasMany,
} from "sequelize-typescript";
import { User } from "./user";
import { Device } from "./device";

@Table
export class Gateway extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Unique(true)
  @Column
  id: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  address: string;

  @Default(false)
  @AllowNull(false)
  @Column
  isOnline: boolean;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  maintainer: number;

  @BelongsTo(() => User) user: User;

  @HasMany(() => Device) device: Device;
}
