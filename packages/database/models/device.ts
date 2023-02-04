import { 
    Table, Column, Model, BelongsTo, ForeignKey, AllowNull
} from 'sequelize-typescript'
import { User } from './user'

@Table
export class Device extends Model {

    @AllowNull(false)
    @Column
    name: string

    @AllowNull(false)
    @Column
    address: string

    @ForeignKey(() => User)
    @Column
    maintainer: number

    @BelongsTo(() => User) user: User;

}
