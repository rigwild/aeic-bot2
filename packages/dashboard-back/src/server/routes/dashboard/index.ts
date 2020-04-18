import express from 'express'
import { Router } from 'express-serve-static-core'

import discordUser from './discordUser'
import exoPlatform from './exoPlatform'
import tpGroup from './tpGroup'
import scodoc from './scodoc'
import moodle from './moodle'

const router = express.Router() as Router

router.use(discordUser)
router.use(exoPlatform)
router.use(tpGroup)
router.use(scodoc)
router.use(moodle)

export default router
