import { Router } from "express";
import { Authorization } from "../user/middleware";
import {
  register,
  profil,
  destroy,
  get_all_devices,
  get_values,
  get_latest_value,
  get_devices_non_auth,
} from "./controller";

const router: Router = Router();

router.get("/general", get_devices_non_auth);
router.get("/:id/values", get_values);
router.get("/:id", profil);
router.get("/:id/la", get_latest_value);

router.post("/", Authorization, register);
router.delete("/:id", Authorization, destroy);
router.get("/", Authorization, get_all_devices);

export default router;
