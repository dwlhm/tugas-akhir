import { Csv_List } from "database/models/Csv_List";
import { Device } from "database/models/device";
import { Device_History } from "database/models/Device_History";
import { Device_Value } from "database/models/Device_Value";
import { Latest_Device_Value } from "database/models/Latest_Device_Value";
import { User } from "database/models/user";
import { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import { Op } from "sequelize"

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let errors = [];
    if (!req.body.name) errors.push("Field name not completed");
    if (!req.body.gateway_id) errors.push("Field gateway_id not completed");
    if (errors.length > 0)
      return res.status(400).json({
        code: 400,
        error: errors,
      });
    const findDevice = await Device.findOne({
      where: {
        name: req.body.name,
        gateway_id: req.body.gateway_id,
      },
    });
    if (findDevice) throw new Error("409#device");
    const device_id: string = crypto.randomBytes(4).toString("hex");
    const device = await Device.create({
      ...req.body,
      maintainer: req.user.id,
      id: device_id,
    });
    const latest_table = await Latest_Device_Value.create({
      device_id: device_id,
    });

    return res.status(200).json({
      code: 200,
      body: {
        ...device.dataValues,
        updatedAt: undefined,
      },
    });
  } catch (error) {
    console.error("[device_register] ", error);

    let errors: string[] = [];
    if (error.message.lastIndexOf("notNull Violation") > -1) {
      errors = error.message
        .replace(/notNull Violation: Device./gi, "Field ")
        .split(",\n");
      return res.status(400).json({
        code: 400,
        error: errors,
      });
    }

    if (error.message.lastIndexOf("foreign key constraint fails") > -1) {
      return next(new Error("404#gateway"));
    }

    next(error);
  }
};

const profil = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const device_id: number = req.params["id"] as unknown as number;

    const device = await Device.findByPk(device_id, {
      include: [
        {
          model: User,
          attributes: {
            exclude: ["id", "password"],
          },
        },
        {
          model: Latest_Device_Value,
          attributes: {
            exclude: ["id", "device_id", "createdAt"]
          }
        },
      ],
    });

    if (!device) throw new Error("404#device");

    return res.status(200).json({
      code: 200,
      body: device,
    });
  } catch (err) {
    console.log("[Device Profil] ", err.message);

    next(err);
  }
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const device_id = req.params["id"];

    let destroying = await Latest_Device_Value.destroy({
      where: {
        device_id: device_id,
      },
    });

    destroying = await Device.destroy({
      where: {
        id: device_id,
      },
    });

    if (!destroying) throw new Error("404#device");

    return res.status(200).json({
      code: 200,
      body: {
        status: "success",
      },
    });
  } catch (err) {
    console.log("[Device Delete] ", err.message);

    next(err);
  }
};

const get_all_devices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gatewayId = req.query['gateway']
    const devices = gatewayId ? await Device.findAll({ include: Latest_Device_Value, where: {
      gateway_id: gatewayId
    } }) : await Device.findAll({ include: Latest_Device_Value });

    res.status(200).json({
      code: 200,
      body: devices,
    });
  } catch (err) {
    console.error("[get_all_devices] ", err.message);

    next(err);
  }
};

const get_values = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const device_id = req.params["id"];
    const values = await Device_Value.findAll({
      where: {
        device_id: device_id,
      },
      limit: 100,
      attributes: {
        exclude: ["id", "updatedAt"],
      },
    });

    if (!values) throw new Error("404#devicevalue");

    res.status(200).json({
      code: 200,
      body: values,
    });
  } catch (err) {
    console.error("[get_values] ", err.message);

    next(err);
  }
};

const get_latest_value = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const device_id = req.params["id"];
    const value = await Latest_Device_Value.findOne({
      where: {
        device_id: device_id,
      },
    });

    if (!value) throw new Error("404#devicevalue");

    res.status(200).json({
      code: 200,
      body: value,
    });
  } catch (err) {
    console.error("[get_latest_value] ", err.message);

    next(err);
  }
};

const get_history = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const device_id = req.params["id"];
    const req_limit = Number(req.query["limit"]) || 2;
    const req_offset = Number(req.query["offset"]) || 0;
    const prev_date = new Date()
    prev_date.setDate(prev_date.getDate() - 6)
    const req_from = req.query["from"] ? new Date(String(req.query["from"])) : prev_date;
    const req_to = req.query["to"] ? new Date(String(req.query["to"])) : new Date();
    const {rows, count} = await Device_History.findAndCountAll({
      where: {
        timestamp: {
          [Op.lte]: req_to,
          [Op.gte]: req_from
        }
      },
      offset: req_offset,
      limit: req_limit,
      attributes: {
        exclude: ['id', 'createdAt', 'device_id', 'gateway_id'],
      }
    })

    if (!rows) throw new Error("404#devicevalue");

    res.status(200).json({
      code: 200,
      body: {
        list: rows,
        maximum: req_limit*(req_offset + 1) >= count,
        total: count
      },
    });
  } catch (error) {
    console.error("[get_history] ", error.message);

    next(error);
  }
};

const update_device_profil = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.name && !req.body.address)
      return res.status(400).json({
        code: 400,
        error: ["No field to be updated"],
      });
    await Device.update(
      {
        ...req.body,
      },
      {
        where: {
          id: req.params["id"],
        },
      }
    );

    return res.status(200).json({
      code: 200,
      body: {
        ...req.body,
      },
    });
  } catch (error) {
    console.error("[update_device_profil] ", error.message);

    next(error);
  }
};

export {
  register,
  profil,
  destroy,
  get_all_devices,
  get_values,
  get_latest_value,
  get_history,
  update_device_profil,
};
