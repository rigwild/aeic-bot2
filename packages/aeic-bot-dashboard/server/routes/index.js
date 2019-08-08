import express from 'express'

import login from './login'
import dashboard from './dashboard'
import { checkJwt, checkNoJwt } from '../middlewares'

const router = express.Router()

router.use('/login', checkNoJwt, login)
router.use('/dashboard', checkJwt, dashboard)

export default router
