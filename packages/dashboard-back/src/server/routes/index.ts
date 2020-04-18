import express from 'express'
import { Router } from 'express-serve-static-core'

import login from './login'
import dashboard from './dashboard'
import { checkJwt, checkNoJwt } from '../middlewares'

const router = express.Router() as Router

router.get('/checkUp', (req, res) => res.status(200).end())
router.use('/login', checkNoJwt, login)
router.use('/dashboard', checkJwt, dashboard)

export default router
