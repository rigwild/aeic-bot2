import express from 'express'

import discordUser from './discordUser'
import exoPlatform from './exoPlatform'
import tpGroup from './tpGroup'
import scodoc from './scodoc'
import moodle from './moodle'

const router = express.Router()

router.use(discordUser)
router.use(exoPlatform)
router.use(tpGroup)
router.use(scodoc)
router.use(moodle)

export default router
