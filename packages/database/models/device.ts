import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  AllowNull,
  Unique,
  PrimaryKey,
} from "sequelize-typescript";
import { Gateway } from "./gateway";
import { User } from "./user";

@Table
export class Device extends Model {
  @AllowNull(false)
  @PrimaryKey
  @Unique(true)
  @Column
  id: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  address: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  maintainer: number;

  @ForeignKey(() => Gateway)
  @AllowNull(false)
  @Column
  gateway_id: string;

  @BelongsTo(() => User) user: User;

  @BelongsTo(() => Gateway) gateway: Gateway;
}
