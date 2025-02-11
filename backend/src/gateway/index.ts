import { Router } from "express";
import { Authorization } from "../user/middleware";
import {
  destroy,
  get_all_gateway,
  get_gateway_mqtt,
  profil,
  register,
  update_gateway_profil
} from "./controller";

const router: Router = Router();

router.get("/:id", profil);

router.post("/", Authorization, register);
router.delete("/:id", Authorization, destroy);
router.get("/", Authorization, get_all_gateway);
router.get("/:id/mqtt", Authorization, get_gateway_mqtt);
router.put("/:id", Authorization, update_gateway_profil);

export default router;
