import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { Device } from "./models/device";
import { Device_Value } from "./models/Device_Value";
import { Latest_Device_Value } from "./models/Latest_Device_Value";
import { User } from "./models/user";
import { Gateway } from "./models/gateway";
import { Gateway_Mqtt } from "./models/gateway-mqtt";
import { User_Session } from "./models/user_session";
import { Metadata } from "./models/Metadata";
import { Duplication_Order } from "./models/Duplication_Order";
import { Csv_List } from "./models/Csv_List";
import { Device_History } from "./models/Device_History";

dotenv.config();

const db_name = process.env.DB_NAME as string;
const db_user = process.env.DB_USER as string;
const db_password = process.env.DB_PASSWORD as string;
const db_host = process.env.DB_HOST as string;

const connection = new Sequelize(db_name, db_user, db_password, {
  host: db_host,
  dialect: "mariadb",
  models: [
    User,
    Device,
    Device_Value,
    Gateway_Mqtt,
    Gateway,
    User_Session,
    Latest_Device_Value,
    Metadata,
    Duplication_Order,
    Csv_List,
    Device_History,
  ],
});

export const sqlz = async (query: string) => {
  console.log("RAW QUERY", query)
  // const res = await connection.query(query);
  // console.log('RES', res)

  return "hh"
};

export default connection;
