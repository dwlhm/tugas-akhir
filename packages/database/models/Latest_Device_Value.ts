import { BelongsTo, Column, ForeignKey, Table, Model } from "sequelize-typescript";
import { Device } from "./device";

@Table
export class Latest_Device_Value extends Model {
    @Column
    value: String;

    @ForeignKey(() => Device)
    @Column
    device_id: String;

    @BelongsTo(() => Device) device: Device;
}