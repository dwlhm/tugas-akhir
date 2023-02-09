import { Client } from "aedes:client";
import { Device_Value } from "database/models/Device_Value";

const Publish_Packet = async (packet: any, client: Client) => {
  try {
    const message = packet.payload.toString("ascii");
    const payload = JSON.parse(message);

    const device_id = payload.device.id;

    await Device_Value.create({
      device_id: device_id,
      gateway_id: client.id,
      value: message,
    });

    console.log("[Publish_Packet] ", device_id);
  } catch (err) {
    console.error("[Publish_Packet] ", err.message);
  }
};

export { Publish_Packet };
