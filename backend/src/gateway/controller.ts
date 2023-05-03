import { Gateway } from "database/models/gateway";
import { User } from "database/models/user";
import { User_Session } from "database/models/user_session";
import bcrypt from "bcrypt";
import { Gateway_Mqtt } from "database/models/gateway-mqtt";
import { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import { Latest_Device_Value } from "database/models/Latest_Device_Value";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.name)
      return res.status(400).json({
        code: 400,
        error: ["Field name not completed"],
      });
    const findGateway = await Gateway.findOne({
      where: {
        maintainer: req.user.id,
        name: req.body.name,
      },
    });
    if (findGateway) throw new Error("409#gateway");
    const client_id: string = crypto.randomBytes(4).toString("hex");
    const client_username: string = crypto.randomBytes(4).toString("hex");
    const client_password: string = crypto.randomBytes(8).toString("hex");

    const gateway = await Gateway.create({
      ...req.body,
      id: client_id,
      maintainer: req.user.id,
    });

    await Gateway_Mqtt.create({
      credential: Buffer.from(`${client_username}:${client_password}`).toString(
        "base64"
      ),
      topic_data: `node/${client_id}/prod/data`,
      topic_action: `node/${client_id}/prod/action`,
      gateway_id: client_id,
    });

    return res.status(201).json({
      code: 201,
      body: {
        ...gateway.dataValues,
        updatedAt: undefined,
      },
    });
  } catch (err) {
    console.log("[Gateway Register] ", err.message);
    let errors: string[] = [];
    if (err.message.lastIndexOf("notNull Violation") > -1) {
      errors = err.message
        .replace(/notNull Violation: Gateway./gi, "Field ")
        .split(",\n");
      return res.status(400).json({
        code: 400,
        error: errors,
      });
    }
    next(err);
  }
};

const profil = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gateway_id: string = req.params["id"];
    const gateway = await Gateway.findByPk(gateway_id, {
      include: {
        model: User,
        attributes: {
          exclude: [ "id", "password" ]
        }
      }
    });

    if (!gateway) throw new Error("404#gateway");

    return res.status(200).json({
      code: 200,
      body: gateway,
    });
  } catch (err) {
    console.error("[Gateway Profil] ", err.message);

    next(err);
  }
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gateway_id: string = req.params["id"];
    let destroying = await Gateway_Mqtt.destroy({
      where: {
        gateway_id: gateway_id,
      },
    });

    destroying = await Gateway.destroy({
      where: {
        id: gateway_id
      },
    });

    if (!destroying) throw new Error("404#gateway");

    return res.status(200).json({
      code: 200,
      body: {
        status: "success",
      },
    });
  } catch (err) {
    if (err.message.lastIndexOf("Cannot delete or update a parent row:") > -1) {
        err = new Error('412#gateway')
    }

    console.error("[Gateway Destroy] ", err.message);
    next(err);
  }
};

const get_all_gateway = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gateways = await Gateway.findAll();

    res.status(200).json({
      code: 200,
      body: gateways,
    });
  } catch (err) {
    console.error("[get_all_gateway] ", err.message);

    next(err);
  }
};

const get_gateway_mqtt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const gateway_id = req.params["id"];

    const mqtt_detail = await Gateway_Mqtt.findOne({
      where: {
        gateway_id: gateway_id,
      },
    });

    if (!mqtt_detail) throw new Error("404#gateway");

    res.status(200).json({
      code: 200,
      body: {
        ...mqtt_detail.dataValues,
        id: undefined,
        credential: Buffer.from(mqtt_detail.dataValues.credential, "base64")
          .toString()
          .split(":"),
      },
    });
  } catch (err) {
    console.error("[get_gateway_mqtt] ", err.message);

    if (err.message.lastIndexOf("reading 'split'") > -1) {
      return next(new Error("401#notbasic"));
    }
    next(err);
  }
};

export { register, profil, destroy, get_all_gateway, get_gateway_mqtt };
