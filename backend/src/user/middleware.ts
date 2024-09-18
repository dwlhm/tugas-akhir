import { User_Session } from "database/models/user_session";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import path from "path";
import { readFileSync } from "fs";

const Authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;
    const [method, access_token] = authorization.split(" ");

    console.log(method);
    if (method !== "Bearer") throw new Error("401#1");

    const public_key = readFileSync(
      path.join(__dirname, "../../secret/public.pem"),
      "utf8"
    );

    const user = await verify(access_token, public_key);
    console.log(user);
    const findUser = await User_Session.findOne({
      where: {
        user_id: user.id,
      },
    });

    if (!findUser) throw new Error("401#2");

    req.user = user;

    return next();
  } catch (error) {
    console.error("[authorization]", error);

    let errors: string[] = [];

    if (error.message.lastIndexOf("Cannot read properties of undefined") > -1) {
      errors.push("uncompleted authorization field");
    }
    if (error.message === "401#1") {
      errors.push("wrong authentication method");
    }
    if (error.message === "401#2") {
      errors.push("wrong access token");
    }
    if (
      error.message.lastIndexOf(
        '"user_id" has invalid "undefined" value' || error.message === "401#2"
      ) > -1
    ) {
      errors.push("wrong refresh token");
    }

    return res.status(401).json({
      code: 401,
      error: errors.length > 0 ? errors : [error.message],
    });
  }
};

export { Authorization };
