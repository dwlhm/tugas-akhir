import { AuthErrorCode, AuthenticateError } from "aedes";
import { Client } from "aedes:client";
import { Gateway_Mqtt } from "database/models/gateway-mqtt";

export const Authenticate = async (
  client: Client,
  username: string,
  password: any,
  cb: any
) => {
  try {
    const password_extracted: string = password.toString("hex");

    console.log(username, password_extracted);

    const gateway = await Gateway_Mqtt.findOne({
      where: {
        credential: Buffer.from(`${username}:${password}`).toString("base64"),
        gateway_id: client.id,
      },
    });

    if (!gateway) throw new Error("404#gateway");

    console.log(`[authenticate] ${client.id} joined`);

    cb(null, true);
  } catch (err) {
    let error: AuthenticateError = new Error(
      "error occured"
    ) as AuthenticateError;

    error.returnCode = AuthErrorCode.SERVER_UNAVAILABLE;
    if (err.message == "404#gateway") {
      error.returnCode = AuthErrorCode.NOT_AUTHORIZED;
    }

    cb(error, null);
  }
};
