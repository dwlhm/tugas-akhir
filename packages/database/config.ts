import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize"
import dotenv from 'dotenv'
import { Device } from './models/device'
import { Device_Value } from './models/Device_Value'
import { User } from './models/user'
import { Gateway } from './models/gateway'
import { Gateway_Mqtt } from './models/gateway-mqtt'

dotenv.config()

const db_name = process.env.DB_NAME as string
const db_user = process.env.DB_USER as string
const db_password = process.env.DB_PASSWORD as string
const db_host = process.env.DB_HOST as string
const db_driver = 'mariadb'

console.log(db_name)

const connection = new Sequelize(db_name, db_user, db_password, {
    host: db_host,
    dialect: 'mariadb',
    models: [User, Device, Device_Value, Gateway_Mqtt, Gateway]
})

export default connection
