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
export class Latest_Device_Value extends Model {

    @Column
    value: string;

    @ForeignKey(() => Device)
    @Column
    device_id: String;

    @BelongsTo(() => Device) device: Device;

    @ForeignKey(() => Gateway)
    @Column
    gateway_id: String;

    @BelongsTo(() => Gateway) gateway: Gateway;

}