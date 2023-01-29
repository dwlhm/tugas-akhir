import Aedes from "aedes";
import dotenv from 'dotenv'
import { createServer } from 'aedes-server-factory'

dotenv.config()

const aedes = new Aedes()
const server = createServer(aedes)
const PORT = process.env.PORT || 1883

server.listen(PORT, () => {
    console.info(`MQTT: Broker started on ${PORT}!`)
})

