import express from 'express'

import { utilsCore } from '@aeic-bot2/core'
const { ExoPlatformLoader } = utilsCore

import { asyncMiddleware, checkRequiredParameters } from '../../utils'

const router = express.Router()

// Find someone on eXo Platform
router.get('/eXoPlatform/:search', asyncMiddleware(async (req, res) => {
  const { search } = checkRequiredParameters(['search'], req.params)
  res.json({
    data: await ExoPlatformLoader.searchUser(search)
  })
}))

export default router
