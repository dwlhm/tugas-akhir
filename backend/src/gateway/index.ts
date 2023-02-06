import { Router } from 'express'
import { Authorization } from '../user/middleware'
import { destroy, profil, register } from './controller'

const router: Router = Router()

router.post('/', Authorization, register)
router.get('/:id', Authorization, profil)
router.delete('/:id', Authorization, destroy)

export default router
