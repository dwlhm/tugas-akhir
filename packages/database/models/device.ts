import { 
    Table, Column, Model, BelongsTo
} from 'sequelize-typescript'
import { User } from './user'

@Table
export class Device extends Model {

    @Column
    name: string

    @Column
    address: string

    @BelongsTo(() => User) user: User;

}
