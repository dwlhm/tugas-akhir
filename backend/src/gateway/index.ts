import { Router } from 'express'
import { Authorization } from '../user/middleware'
import { destroy, get_all_gateway, get_gateway_mqtt, profil, register } from './controller'

const router: Router = Router()

router.post('/', Authorization, register)
router.get('/:id', Authorization, profil)
router.delete('/:id', Authorization, destroy)
router.get('/', Authorization, get_all_gateway)
router.get('/:id/mqtt', get_gateway_mqtt)

export default router
