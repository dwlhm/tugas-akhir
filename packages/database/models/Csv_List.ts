import { AllowNull, Column, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";

@Table
export class Csv_List extends Model {

    @AllowNull(false)
    @PrimaryKey
    @Unique(true)
    @Column
    id: String

    @Column
    list: String

}