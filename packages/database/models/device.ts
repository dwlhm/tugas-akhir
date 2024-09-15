import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  AllowNull,
  Unique,
  PrimaryKey,
  HasMany
} from "sequelize-typescript";
import { Gateway } from "./gateway";
import { User } from "./user";
import { Latest_Device_Value } from "./Latest_Device_Value";
import { Device_History } from "./Device_History";

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

  @HasMany(() => Latest_Device_Value) latest_device_value: Latest_Device_Value;

  @HasMany(() => Device_History) device_history: Device_History;
}

