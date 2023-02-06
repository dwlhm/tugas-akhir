import Aedes, { AuthErrorCode } from "aedes";
import dotenv from 'dotenv'
import { createServer } from 'aedes-server-factory'
import { Client } from "aedes:client";
import { Custom_Error } from './types/custom_error'
import { AuthenticateError } from "aedes:server";
import { resolve4 } from "dns";

dotenv.config()

const aedes = new Aedes()
const server = createServer(aedes)
const PORT = process.env.PORT || 1883

server.listen(PORT, () => {
    console.info(`MQTT: Broker started on ${PORT}!`)
})

aedes.authenticate = async (
    client: Client,
    username: string,
    password: any,
    cb
) => {

    console.log('[Authenticate] One client joining!')

    console.log('[Client ID] ', client.id)

    const password_extracted: string = password.toString('hex')

    console.log(username, password_extracted)

    const error:AuthenticateError = new Error('sss') as AuthenticateError
    error.returnCode = AuthErrorCode.SERVER_UNAVAILABLE

    cb(error ,null)
}
