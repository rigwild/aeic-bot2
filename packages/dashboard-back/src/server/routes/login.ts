import express from 'express'
import jwt from 'jsonwebtoken'
import fetch from 'node-fetch'
import btoa from 'btoa'
import boom from '@hapi/boom'
import { User } from 'discord.js'

import { DISCORD_REDIRECT_URI, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, SERVER_SECRET } from '../../config'
import { asyncMiddleware } from '../utils'
import { addDbData } from '../db'
import { getUser } from '../bot'

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

  // Load user data
  const me: User = await fetch('https://discordapp.com/api/users/@me', {
    headers: { Authorization: `Bearer ${token.access_token}` }
  }).then(_res => _res.json())

  // Check data is valid
  if (!me.id) throw boom.internal('Invalid data was collected.')

  const user = await getUser(me.id)
  if (!user) throw boom.internal('Your Discord account was not found in the AEIC server.')
  const roles = user.roles.map(aRole => aRole.name)

  addDbData(token, me)
  const jwtToken = jwt.sign({
    ...me
  }, SERVER_SECRET, { expiresIn: '7d' })

  res.json({
    data: {
      token: jwtToken,
      discordUser: {
        ...me,
        roles
      }
    }
  })
}))

export default router
