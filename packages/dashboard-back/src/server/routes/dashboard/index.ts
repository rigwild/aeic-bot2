import express from 'express'

import discordUser from './discordUser'
import exoPlatform from './exoPlatform'
import tpGroup from './tpGroup'

const router = express.Router()

router.use(discordUser)
router.use(exoPlatform)
router.use(tpGroup)

export default router
