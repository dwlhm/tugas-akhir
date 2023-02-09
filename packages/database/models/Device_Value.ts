import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { Device } from "./device";
import { Gateway } from "./gateway";

@Table
export class Device_Value extends Model {
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
}
