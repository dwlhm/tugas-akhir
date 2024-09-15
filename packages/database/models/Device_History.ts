import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Device } from "./device";
import { Gateway } from "./gateway";

@Table
export class Device_History extends Model {

  @Column
  value: string;

  @ForeignKey(() => Device)
  @Column
  device_id: string;

  @BelongsTo(() => Device) device: Device;

  @ForeignKey(() => Gateway)
  @Column
  gateway_id: string;

  @BelongsTo(() => Gateway) gateway: Gateway;

  @Index
  @Column
  timestamp: Date;
}
