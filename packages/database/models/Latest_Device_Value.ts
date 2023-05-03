import { BelongsTo, Column, ForeignKey, Table, Model, DataType, HasMany } from "sequelize-typescript";
import { Device } from "./device";
import { Metadata } from "./Metadata";

@Table
export class Latest_Device_Value extends Model {

    @Column
    value: String;

    @ForeignKey(() => Device)
    @Column
    device_id: String;

    @BelongsTo(() => Device) device: Device;
}