import {
  Table,
  Column,
  Model,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user";

@Table
export class User_Session extends Model {
  @AllowNull(false)
  @Column
  uuid: string;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User) user: User;
}
