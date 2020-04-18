import express from 'express'
import { Router } from 'express-serve-static-core'

import { utilsCore } from '@aeic-bot2/core'
const { ExoPlatformLoader } = utilsCore

import { asyncMiddleware, checkRequiredParameters } from '../../utils'

const router = express.Router() as Router

// Find someone on eXo Platform
router.get('/eXoPlatform/:search', asyncMiddleware(async (req, res) => {
  const { search } = checkRequiredParameters(['search'], req.params)
  res.json({
    data: await ExoPlatformLoader.searchUser(search)
  })
}))

export default router
