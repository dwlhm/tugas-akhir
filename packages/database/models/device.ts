import { 
    Table, Column, Model, BelongsTo, ForeignKey
} from 'sequelize-typescript'
import { User } from './user'

@Table
export class Device extends Model {

    @Column
    name: string

    @Column
    address: string

    @ForeignKey(() => User)
    @Column
    maintainer: number

    @BelongsTo(() => User) user: User;

}
