import {
    Table, Column, Model, BelongsTo, ForeignKey
} from 'sequelize-typescript'
import { Gateway } from './gateway'

@Table 
export class Gateway_Mqtt extends Model {

    @Column 
    credential: string

    @Column 
    topic_data: string

    @Column
    topic_action: string

    @ForeignKey(() => Gateway)
    @Column
    gateway_id: number

    @BelongsTo(() => Gateway) gateway: Gateway

}

