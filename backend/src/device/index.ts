import { Router } from "express";
import { Authorization } from "../user/middleware";
import {
  register,
  profil,
  destroy,
  get_all_devices,
  get_values,
  get_latest_value,
} from "./controller";

const router: Router = Router();

router.get("/:id/values", Authorization, get_values);
router.get("/:id", Authorization, profil);
router.get("/:id/la", Authorization, get_latest_value);

router.post("/", Authorization, register);
router.delete("/:id", Authorization, destroy);
router.get("/", Authorization, get_all_devices);

export default router;
