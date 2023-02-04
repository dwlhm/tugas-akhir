import { Router } from 'express'
import { Authorization } from '../user/middleware'
import { register } from './controller'

const router: Router = Router()

router.post('/', Authorization, register)

export default router
