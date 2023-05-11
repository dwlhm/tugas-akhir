import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Device } from "./device";

@Table
export class Duplication_Order extends Model {

    @Column
    value: String;
    
    @ForeignKey(() => Device)
    @Column
    device_id: String;

    @BelongsTo(() => Device) device: Device;
    
}