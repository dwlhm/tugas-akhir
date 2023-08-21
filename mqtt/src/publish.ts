import Aedes from "aedes";
import { Client } from "aedes:client";
import fs from "fs";
import { Duplication_Order } from "database/models/Duplication_Order";
import { Latest_Device_Value } from "database/models/Latest_Device_Value";
import { Metadata } from "database/models/Metadata";

const Publish_Packet = async (packet: any, client: Client, aedes: Aedes) => {
  try {
    
    // get gateway id
    // console.log('[client.id]', client.id)

    // get the message
    const message = packet.payload.toString("ascii");
    console.log('[RCV MSG] ', message);
    if (message.lastIndexOf(";") !== message.length-1) return;

    // do for loop
    let pk_order = ""
    let new_pk = ""
    let complete_message = ""
    let arr_message = message.split(';')
    
    for (let i = 0; i < arr_message.length-1; i++) {
      const element = arr_message[i];
      // console.log('[msg for] ', element)
      // get the new chunk
      console.log(element)
      if (!Number(element)) {
        // store the new chunk in metadata table
        let metadata = await Metadata.create({
          value: element
        })
        pk_order += metadata.id + ","
        new_pk += metadata.id + ","
        complete_message += element
      } else {
        pk_order += element + ","
        console.log(element)
        let data_chunk = await Metadata.findByPk(element)
        if (!data_chunk) {
          aedes.publish({
            cmd: 'publish',
              messageId: 42,
              qos: 2,
              dup: false,
              topic: `node/${client.id}/prod/action`,
              payload: Buffer.from("r"),
              retain: false
          }, () => {})
          throw new Error("not synchronized");
        }
        complete_message += data_chunk.dataValues.value
      }
    }
    // console.log('[pk_order] ', pk_order)
    // console.log('[new_pk] ', new_pk)
    // console.log('[complete_message]', complete_message)

    const lastIndex = complete_message.lastIndexOf(";")

    if ((lastIndex + 1) >= complete_message.length) {
      complete_message = complete_message.slice(0, lastIndex);
    }

    // parse it 
    const json_parse = JSON.parse(complete_message);
    // console.log('[json_parse] ', complete_message);

    // get the device id
    const device_id = json_parse.id;

    if (!device_id) throw new Error("device id not recognized")
    // save json_parse var to latest_device_value
    await Latest_Device_Value.update({
      value: complete_message,
      updatedAt: new Date()
    }, {
      where: {
        device_id: device_id
      }
    });

    const currentDate = new Date();
    const currMonth = currentDate.getMonth();
    const currYear = currentDate.getFullYear();
    let archive = {
      time: currentDate.toLocaleString(),
      "1": "",
      "2": "",
      "0": "",
      "3": "",
      a: "",
      v: "",
      t: "",
      h: ""
    };
    const devValueText = json_parse.data.split("|");
    const devValue = devValueText[1].split(",");
    for (let i = 0; i < devValueText[0].length; i++) {
      archive[devValueText[0].charAt(i)] = devValue[i];
    }
    const checkCsv = fs.existsSync("../backend/public/"+ device_id + "-" + currMonth + "-" + currYear + ".csv");
    if (!checkCsv) {
      const csvStream = fs.createWriteStream("../backend/public/"+ device_id + "-" + currMonth + "-" + currYear + ".csv", { flags: "a" })
      csvStream.write("timestamp");
      csvStream.write(";");
      csvStream.write("PM_1.0");
      csvStream.write(";");
      csvStream.write("PM_2.5");
      csvStream.write(";");
      csvStream.write("PM_10");
      csvStream.write(";");
      csvStream.write("PM_100");
      csvStream.write(";");
      csvStream.write("temp");
      csvStream.write(";");
      csvStream.write("humidity");
      csvStream.write(";");
      csvStream.write("arah_angin");
      csvStream.write(";");
      csvStream.write("kecepatan_angin");
      csvStream.end("\n");
    }
    const csvStream = fs.createWriteStream("../backend/public/"+ device_id + "-" + currMonth + "-" + currYear + ".csv", { flags: "a" })
    csvStream.write(archive.time);
    csvStream.write(";");
    csvStream.write(archive["1"]);
    csvStream.write(";");
    csvStream.write(archive["2"]);
    csvStream.write(";");
    csvStream.write(archive["0"]);
    csvStream.write(";");
    csvStream.write(archive["3"]);
    csvStream.write(";");
    csvStream.write(archive.t);
    csvStream.write(";");
    csvStream.write(archive.h);
    csvStream.write(";");
    csvStream.write(archive.a);
    csvStream.write(";");
    csvStream.write(archive.v);
    csvStream.end("\n");

    // store the pk_order to Duplication_Orders
    await Duplication_Order.create({
      value: pk_order,
      device_id: device_id
    })

    // send new primary key back to corresponding gateway with mqtt
    if (new_pk !== "") aedes.publish({
      cmd: 'publish',
        messageId: 42,
        qos: 2,
        dup: false,
        topic: `node/${client.id}/prod/action`,
        payload: Buffer.from(new_pk.slice(0,-1) + ";"),
        retain: false
    }, () => {})
    else aedes.publish({
      cmd: 'publish',
        messageId: 42,
        qos: 2,
        dup: false,
        topic: `node/${client.id}/prod/action`,
        payload: Buffer.from("0"),
        retain: false
    }, () => {})

  } catch (err) {
    console.error("[Publish_Packet] ", err);
  }
};

export { Publish_Packet };
