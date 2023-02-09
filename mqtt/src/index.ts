import Aedes from "aedes";
import dotenv from "dotenv";
import { createServer } from "aedes-server-factory";
import { Authenticate } from "./authenticate";
import Database from "database";
import { Authorize_Publish, Authorize_Subscribe } from "./authorize";
import { Publish_Packet } from "./publish";

dotenv.config();

Database();

const aedes = new Aedes();
const server = createServer(aedes);
const PORT = process.env.PORT || 1883;

Database();
server.listen(PORT, () => {
  console.info(`MQTT: Broker started on ${PORT}!`);
});

aedes.authenticate = Authenticate;
aedes.authorizeSubscribe = Authorize_Subscribe;
aedes.authorizePublish = Authorize_Publish;
aedes.on("publish", Publish_Packet);
