import Aedes from "aedes";
import { Client } from "aedes:client";
import { Duplication_Order } from "database/models/Duplication_Order";
import { Latest_Device_Value } from "database/models/Latest_Device_Value";
import { Metadata } from "database/models/Metadata";

const Publish_Packet = async (packet: any, client: Client, aedes: Aedes) => {
  try {
    
    // get gateway id
    // console.log('[client.id]', client.id)

    // get the message
    const message = packet.payload.toString("ascii");
    console.log('[RCV MSG] ', message)

    // concat it
    const json_str = message.replace(/;/g, "");
    // console.log('[JSON MSG] ', json_str); 



    // do for loop
    let pk_order = ""
    let new_pk = ""
    let complete_message = ""
    let arr_message = message.split(';')
    
    for (let i = 0; i < arr_message.length; i++) {
      const element = arr_message[i];
      // console.log('[msg for] ', element)
      // get the new chunk
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
        let data_chunk = await Metadata.findByPk(element)
        complete_message += data_chunk.dataValues.value
      }
    }
    // console.log('[pk_order] ', pk_order)
    // console.log('[new_pk] ', new_pk)
    // console.log('[complete_message]', complete_message)

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
        payload: Buffer.from(new_pk),
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
