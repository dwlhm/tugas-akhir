import { User } from "database/models/user";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { readFileSync } from "fs";
import { sign, verify } from "jsonwebtoken";
import path from "path";
import { v4 as uuid } from "uuid";
import { User_Session } from "database/models/user_session";

const register = async (req: Request, res: Response) => {
  try {
    let password = bcrypt.hashSync(req.body.password, 10);
    const user = await User.create({ ...req.body, password: password });
    return res.status(200).json({
      code: 200,
      body: {
        ...user.dataValues,
        id: undefined,
        updatedAt: undefined,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error.toString());

    let errors: string[] = [];
    if (error.message.lastIndexOf("notNull Violation") > -1) {
      errors = error.message
        .replace(/notNull Violation: User./gi, "Field ")
        .split(",\n");
    }
    if (error.toString().lastIndexOf("SequelizeUniqueConstraintError") > -1) {
      errors.push("duplicate email acount");
    }

    return res.status(400).json({
      code: 400,
      error: errors,
    });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let authorization = req.headers.authorization;
    let [method, str] = authorization.split(" ");

    if (method === "Basic") authorization = str;
    else throw new Error("401#notbasic");

    const extract_str = Buffer.from(authorization, "base64");
    let [username, password] = extract_str.toString().split(":");

    let user = await User.findOne({
      where: {
        email: username,
      },
    });

    if (user == null) throw new Error("400#email");

    const find_session = await User_Session.findOne({
      where: {
        user_id: user.dataValues.id,
      },
    });

    if (find_session) throw new Error("409#login");

    const compare_password = bcrypt.compareSync(
      password,
      user.dataValues.password
    );

    if (!compare_password) throw new Error("400#password");

    const private_key = readFileSync(
      path.join(__dirname, "../../secret/private.pem"),
      "utf8"
    );

    const session = uuid();
    const payload = {
      ...user.dataValues,
      createdAt: undefined,
      password: undefined,
      session: session,
    };

    await User_Session.create({
      user_id: user.dataValues.id,
      uuid: session,
    });

    const options = {
      issuer: "dwlhm",
      subject: "report@dwlhm.space",
      audience: "localhost",
      algorithm: "RS256",
    };

    let token = sign(payload, private_key, options);

    return res.status(202).json({
      code: 202,
      body: {
        ...payload,
        id: undefined,
        session: undefined,
        authentication_token: token,
      },
    });
  } catch (error) {
    console.log("[login]", error);

    next(error);
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    await User_Session.destroy({
      where: {
        user_id: user.id,
      },
    });

    return res.status(200).json({
      code: 200,
      body: {
        status: "success",
      },
    });
  } catch (error) {
    console.error("[]", error.message);

    let errors: string[] = [];
    if (error.message === "401#2") {
      errors.push("wrong refresh token");
    }
    return res.status(400).json({
      code: errors.length > 0 ? 400 : 500,
      error: errors.length > 0 ? errors : "unidentified error",
    });
  }
};

const get_access_token = async (req: Request, res: Response) => {
  try {
    const authorization = req.headers.authorization;
    const [method, refresh_token] = authorization.split(" ");

    if (method == "Bearer ") throw new Error("401#1");

    const public_key = readFileSync(
      path.join(__dirname, "../../secret/public.pem"),
      "utf8"
    );
    const private_key = readFileSync(
      path.join(__dirname, "../../secret/private.pem"),
      "utf8"
    );

    const compare_token = verify(refresh_token, public_key);

    const find_session = await User_Session.findOne({
      where: {
        user_id: compare_token.id,
      },
    });

    if (!find_session) throw new Error("401#2");

    const payload = {
      id: compare_token.id,
      email: compare_token.email,
      name: compare_token.name,
    };

    const options = {
      issuer: "dwlhm",
      subject: "report@dwlhm.space",
      audience: "localhost",
      expiresIn: "1h",
      algorithm: "RS256",
    };
    const access_token = sign(payload, private_key, options);

    return res.status(200).json({
      code: 200,
      body: {
        access_token,
      },
    });
  } catch (error) {
    console.error("[get_access_token] ", error.message);

    let errors: string[] = [];

    if (error.message === "jwt malformed") {
      errors.push("refresh token invalid");
    }
    if (error.message === "401#2") {
      errors.push("wrong refresh token");
    }

    return res.status(400).json({
      code: 400,
      error: errors.length > 0 ? errors : [error.message],
    });
  }
};

const profil = async (req: Request, res: Response) => {
  try {
    let user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ["id", "password"],
      },
    });

    return res.status(200).json({
      code: 200,
      body: {
        ...user.dataValues,
      },
    });
  } catch (error) {
    console.error("[profil] ", error.message);

    return res.status(500).json({
      code: 500,
      error: ["unidentified error"],
    });
  }
};

export { register, login, logout, get_access_token, profil };
