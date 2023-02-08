import { Client } from "aedes:client";

const Publish_Packet = async (
    packet: any,
    client: Client
) => {
    try {
        console.log('[Publish_Packet] ', packet)
    } catch(err) {
        console.error('[Publish_Packet] ',err.message)
    }
}

export {
    Publish_Packet
}
