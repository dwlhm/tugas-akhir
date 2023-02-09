import database from "database";
import { User } from "database/models/user";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

database().then(() => {
  let password = bcrypt.hashSync(process.env.ROOT_PASSWORD, 10);
  User.create({
    id: 1,
    name: "admin",
    email: process.env.ROOT_EMAIL,
    password: password,
    isAdmin: true,
  })
    .catch((err) => console.error(err.message))
    .finally(() => console.info("[User] superuser created!"));
});
