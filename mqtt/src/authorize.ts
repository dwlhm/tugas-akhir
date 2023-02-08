import { Client } from "aedes:client";
import { PublishPacket, SubscribePacket } from "aedes:packet";
import { Gateway_Mqtt } from "database/models/gateway-mqtt";
import { ClientRequest } from "http";

const Authorize_Subscribe = async (
    _,
    packet: PublishPacket,
    cb: any
) => {
    console.log('[Authorize_Subscribe] ', packet)
    try {
        const topic = await Gateway_Mqtt.findOne({
            where: {
                topic_action: packet.topic
            }
        })

        if (!topic) throw new Error('404#gateway')

        cb(null, packet)
    } catch(err) {
        cb(err, null)
    }
}

const Authorize_Publish = async (
    client: Client,
    packet: PublishPacket,
    cb: any
)=>  {
    try {
        const topic = await Gateway_Mqtt.findOne({
            where: {
                topic_data: packet.topic
            }
        })

        if (!topic) throw new Error('404#gateway')

        cb(null)
    } catch(err) {
        console.error('[Authorize_Publish] ', err.message)

        cb(err)
    }
}

export {
    Authorize_Subscribe,
    Authorize_Publish
}
