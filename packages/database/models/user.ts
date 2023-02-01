import { 
    Table, Column, Model, IsUUID, 
    PrimaryKey, IsEmail, Unique, AllowNull 
    } from 'sequelize-typescript'

@Table
export class User extends Model {
    
    @IsEmail
    @Unique
    @AllowNull(false)
    @Column
    email: string   
    
    @AllowNull(false)  
    @Column
    name: string

    @AllowNull(false)
    @Column
    password: string

}
