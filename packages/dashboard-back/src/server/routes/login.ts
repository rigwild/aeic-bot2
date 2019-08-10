import express from 'express'
import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'
import btoa from 'btoa'
import boom from '@hapi/boom'

import { DISCORD_REDIRECT_URI, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, SERVER_SECRET } from '../../config'
import { asyncMiddleware } from '../utils'
import { getDiscordUserProfile } from '../bot'

const router = express.Router()

router.get('/discordRedirect', asyncMiddleware((req, res) => {
  // Redirect to the oauth validation page
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}`)
}))

router.get('/discordCallback/:code', asyncMiddleware(async (req, res) => {
  if (!req.params.code) throw boom.badRequest('No Discord callback code provided.')

  const code = req.params.code

  // Get a token
  const token = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}`, {
    method: 'POST',
    headers: { Authorization: `Basic ${btoa(`${DISCORD_CLIENT_ID}:${DISCORD_CLIENT_SECRET}`)}` }
  }).then(_res => _res.json())
  if (token.error) throw boom.badRequest(token.error_description)

  const discordUser = await getDiscordUserProfile(token.access_token)

  const jwtToken = jwt.sign({
    id: discordUser.id,
    discordToken: token.access_token
  }, SERVER_SECRET, { expiresIn: '7d' })

  res.json({
    data: {
      token: jwtToken,
      discordUser
    }
  })
}))

export default router
