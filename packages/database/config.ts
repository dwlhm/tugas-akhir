import { Sequelize, Dialect } from "sequelize";
import dotenv from 'dotenv'

dotenv.config()

const db_name = process.env.DB_NAME as string
const db_user = process.env.DB_USER as string
const db_password = process.env.DB_PASSWORD as string
const db_host = process.env.DB_HOST as string
const db_driver = process.env.DB_DRIVER as Dialect

const connection = new Sequelize(db_name, db_user, db_password, {
    host: db_host,
    dialect: db_driver
})

export default connection
