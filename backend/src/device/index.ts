import { Router } from "express";
import { Authorization } from "../user/middleware";
import {
    register,
    profil,
    destroy,
    get_all_devices
} from './controller'

const router: Router = Router()

router.post('/', Authorization, register)
router.get('/:id', Authorization, profil)
router.delete('/:id', Authorization, destroy)
router.get('/', Authorization, get_all_devices)

export default router
