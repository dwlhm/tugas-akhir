import { UUIDV4 } from "sequelize";
import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  AllowNull,
  IsUUID,
  PrimaryKey,
  Default,
} from "sequelize-typescript";
import { Gateway } from "./gateway";

@Table
export class Gateway_Mqtt extends Model {
  @AllowNull(false)
  @Column
  credential: string;

  @AllowNull(false)
  @Column
  topic_data: string;

  @AllowNull(false)
  @Column
  topic_action: string;

  @ForeignKey(() => Gateway)
  @Column
  gateway_id: string;

  @BelongsTo(() => Gateway) gateway: Gateway;
}
