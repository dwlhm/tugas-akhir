import Aedes from "aedes";
import { Client } from "aedes:client";
import fs from "fs";
import { Duplication_Order } from "database/models/Duplication_Order";
import { Latest_Device_Value } from "database/models/Latest_Device_Value";
import { Metadata } from "database/models/Metadata";
import dayjs from "dayjs";
import { Device_Value } from "database/models/Device_Value";
const fastCsv = require("fast-csv");

const Publish_Packet = async (packet: any, client: Client, aedes: Aedes) => {
  try {
    // get gateway id
    console.log("[client.id]", packet.topic.includes("data"));

    if (packet.topic.includes("data") <= 0) {
      console.log("NAH");
      return;
    }
    // get the message
    const message = packet.payload.toString("ascii");
    let complete_message = message;
    let pk_order = "";
    let new_pk = "";
    if (message.lastIndexOf(";") == message.length - 1) {
      complete_message = "";
      let arr_message = message.split(";");

      for (let i = 0; i < arr_message.length - 1; i++) {
        const element = arr_message[i];
        if (!Number(element)) {
          let metadata = await Metadata.create({
            value: element,
          });
          pk_order += metadata.id + ",";
          new_pk += metadata.id + ",";
          complete_message += element;
        } else {
          pk_order += element + ",";
          let data_chunk = await Metadata.findByPk(element);
          if (!data_chunk) {
            // send deduplication reset command to node
            aedes.publish(
              {
                cmd: "publish",
                messageId: 42,
                qos: 2,
                dup: false,
                topic: `node/${client.id}/prod/action`,
                payload: Buffer.from("r"),
                retain: false,
              },
              () => {}
            );
            throw new Error("not synchronized");
          }
          complete_message += data_chunk.dataValues.value;
        }
      }
      const lastIndex = complete_message.lastIndexOf(";");

      if (lastIndex + 1 >= complete_message.length) {
        // build the full version of message
        complete_message = complete_message.slice(0, lastIndex);
      }
    }

    const json_parse = JSON.parse(complete_message);
    const device_id = json_parse.id;
    if (!device_id) throw new Error("device id not recognized");

    await Latest_Device_Value.update(
      {
        value: complete_message,
        updatedAt: new Date(),
      },
      {
        where: {
          device_id: device_id,
        },
      }
    );

    // translate to easy format
    let eFormat = {};
    const devValueText = json_parse.data.split("|");
    const devValue = devValueText[1].split(",");
    for (let i = 0; i < devValueText[0].length; i++) {
      eFormat[devValueText[0].charAt(i)] = devValue[i];
    }
    Device_Value.create({
      value: JSON.stringify(eFormat),
      device_id: device_id,
      gateway_id: client.id,
    });

    // store the pk_order to Duplication_Orders
    await Duplication_Order.create({
      value: pk_order,
      device_id: device_id,
    });

    // send new primary key back to corresponding gateway with mqtt
    if (new_pk !== "")
      aedes.publish(
        {
          cmd: "publish",
          messageId: 42,
          qos: 2,
          dup: false,
          topic: `node/${client.id}/prod/action`,
          payload: Buffer.from(new_pk.slice(0, -1) + ";"),
          retain: false,
        },
        () => {}
      );
    else
      aedes.publish(
        {
          cmd: "publish",
          messageId: 42,
          qos: 2,
          dup: false,
          topic: `node/${client.id}/prod/action`,
          payload: Buffer.from("0"),
          retain: false,
        },
        () => {}
      );
  } catch (err) {
    console.error("[Publish_Packet] ", err);
  }
};

export { Publish_Packet };
