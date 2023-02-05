import { Router } from 'express'
import { Authorization } from '../user/middleware'
import { profil, register } from './controller'

const router: Router = Router()

router.post('/', Authorization, register)
router.get('/:id', Authorization, profil)

export default router
