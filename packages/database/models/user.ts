import { 
    Table, Column, Model, IsUUID, 
    PrimaryKey, IsEmail, Unique 
    } from 'sequelize-typescript'

@Table
export class User extends Model {
    
    @Column
    @IsEmail
    @Unique
    email: string   
    
    @Column
    name: string

    @Column
    password: string

}
