import {
    Table, Column, Model, BelongsTo, Default
} from 'sequelize-typescript'
import { User} from './user'

@Table
export class Gateway extends Model {

    @Column 
    name: string

    @Column
    address: string

    @Column
    @Default(true)
    isOnline: boolean

    @BelongsTo(() => User) user: User;

}
