import {
    Table, Column, Model, BelongsTo, ForeignKey
} from 'sequelize-typescript'
import { User } from './user'
import { Device } from './device'

@Table
export class Device_Value extends Model {

    @Column 
    value: string

    @ForeignKey(() => User)
    @Column
    maintainer: number

    @BelongsTo(() => User) user: User

    @ForeignKey(() => Device)
    @Column 
    device_id: number

    @BelongsTo(() => Device) device: Device

}
