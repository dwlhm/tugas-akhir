import express, { Errback, Express, NextFunction, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import User from "./user";
import Sq_Start from "database";
import Device from "./device";
import Gateway from "./gateway";
import { middleware as ErrorMiddleware } from "./error_handler/middleware";
import connection from "database/config";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5423;

(async () => {
  await connection
    .authenticate()
    .then(() => {
      console.info("[sequelize] authenticate!");
    })
    .finally(() => {
      console.info("[sequelize] authenticated!");
    });
  await connection
    .sync({ force: false })
    .then(() => {
      console.info("[sequelize] sync!");
    })
    .finally(() => {
      console.info("[sequelize] sync completed!");
    });

})();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.use("/device", Device);
app.use("/user", User);
app.use("/gateway", Gateway);
app.get("/", (_, res: Response) => {
  res.status(200).json({
    code: 200,
    body: {
      message: "Hello, World!",
    },
  });
});
app.get("*", (_, res: Response) => {
  res.status(404).json({
    code: 404,
    error: ["api not found"],
  });
});

app.use(ErrorMiddleware);

app.listen(port, () => {
  console.info(`[server]: started at localhost:${port}`);
});
