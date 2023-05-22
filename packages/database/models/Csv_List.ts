import { Column, Model, Table } from "sequelize-typescript";

@Table
export class Csv_List extends Model {

    @Column
    list: String
    
}