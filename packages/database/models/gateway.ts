import {
    Table, Column, Model, BelongsTo, Default, ForeignKey
} from 'sequelize-typescript'
import { User} from './user'

@Table
export class Gateway extends Model {

    @Column 
    name: string

    @Column
    address: string

    @Default(true)
    @Column
    isOnline: boolean

    @ForeignKey(() => User)
    @Column
    maintainer: number 

    @BelongsTo(() => User) user: User;

}
