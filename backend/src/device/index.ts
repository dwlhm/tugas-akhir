import { Router } from "express";
import { Authorization } from "../user/middleware";
import {
  register,
  profil,
  destroy,
  get_all_devices,
  get_values,
  get_latest_value,
  get_history,
} from "./controller";

const router: Router = Router();

router.get("/:id/values", Authorization, get_values);
router.get("/:id", profil);
router.get("/:id/la", get_latest_value);
router.get("/:id/history", Authorization, get_history);

router.post("/", Authorization, register);
router.delete("/:id", Authorization, destroy);
router.get("/", get_all_devices);


export default router;
