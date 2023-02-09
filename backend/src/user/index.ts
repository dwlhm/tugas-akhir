import { Router } from "express";
import {
  get_access_token,
  login,
  logout,
  profil,
  register,
} from "./controller";
import { Authorization } from "./middleware";

const router: Router = Router();

router.post("/register", Authorization, register);
router.post("/login", login);
router.post("/logout", Authorization, logout);
router.post("/access-token", get_access_token);
router.get("/", Authorization, profil);

export default router;
