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

router.post("/", Authorization, register);
router.get("/:id/values", Authorization, get_values);
router.get("/:id", Authorization, profil);
router.delete("/:id", Authorization, destroy);
router.get("/", Authorization, get_all_devices);
router.get("/:id/la", Authorization, get_latest_value);

export default router;
