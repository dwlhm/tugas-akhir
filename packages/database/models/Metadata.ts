import { Column, Model, Table } from "sequelize-typescript";

@Table
export class Metadata extends Model {
    @Column
    value: String
}