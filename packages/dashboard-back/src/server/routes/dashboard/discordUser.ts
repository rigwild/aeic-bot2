import express from 'express'
import boom from '@hapi/boom'

import { utilsCore } from '@aeic-bot2/core'
const { tpGroupExists, assoGroupExists, yearGroupExists } = utilsCore
import { defaultYearGroupsName, defaultAssoGroupsName, defaultTpGroupsName } from '@aeic-bot2/common'

import { getGuild, getGuildMember, getDiscordUserProfile } from '../../bot'
import { asyncMiddleware, removeAccents, checkRequiredParameters } from '../../utils'

const router = express.Router()

// Get a Discord user's profile
router.get('/discordUser', asyncMiddleware(async (req, res) =>
  ({ data: await getDiscordUserProfile(req.user.token) })))

// Update a Discord user's year group
router.patch('/discordUser/yearGroup', asyncMiddleware(async (req, res) => {
  const { yearGroup } = checkRequiredParameters(['yearGroup'], req.body)

  // Check the year group exists
  if (!yearGroupExists(yearGroup))
    throw boom.badRequest('Invalid year group.')

  // Delete other year groups roles and add the new one
  const guild = getGuild()
  const user = await getGuildMember(req.user.id)
  const roleToAdd = guild.roles.find(aRole => removeAccents(aRole.name).toLowerCase() === removeAccents(yearGroup).toLowerCase())
  if (!roleToAdd) throw boom.notFound('The new role to add does not exist on the Discord server. No roles were removed from the user.')
  const rolesToDelete = user.roles.filter(aRole => !!defaultYearGroupsName.find(aYearGroup => aYearGroup === removeAccents(aRole.name).toLowerCase()))
  await user.removeRoles(rolesToDelete)
  await user.addRole(roleToAdd)

  res.json({
    data: {
      addedRole: roleToAdd.name,
      deletedRoles: rolesToDelete.map(x => x.name),
      rolesList: user.roles.map(x => x.name)
    }
  })
}))

// Update a Discord user's TP group
router.patch('/discordUser/tpGroup', asyncMiddleware(async (req, res) => {
  const { tpGroup } = checkRequiredParameters(['tpGroup'], req.body)

  // Check the year group exists
  if (!tpGroupExists(tpGroup))
    throw boom.badRequest('Invalid TP group.')

  // Delete other TP groups roles and add the new one
  const guild = getGuild()
  const user = await getGuildMember(req.user.id)
  const roleToAdd = guild.roles.find(aRole => removeAccents(aRole.name).toLowerCase() === removeAccents(tpGroup).toLowerCase())
  if (!roleToAdd) throw boom.notFound('The new role to add does not exist on the Discord server. No roles were removed from the user.')
  const rolesToDelete = user.roles.filter(aRole => !!defaultTpGroupsName.find(aTpGroup => aTpGroup === removeAccents(aRole.name).toLowerCase()))
  await user.removeRoles(rolesToDelete)
  await user.addRole(roleToAdd)

  res.json({
    data: {
      addedRole: roleToAdd.name,
      deletedRoles: rolesToDelete.map(x => x.name),
      rolesList: user.roles.map(x => x.name)
    }
  })
}))

// Update a Discord user's association group
router.patch('/discordUser/assoGroup', asyncMiddleware(async (req, res) => {
  const { assoGroup } = checkRequiredParameters(['assoGroup'], req.body)

  // Check the asso group exists
  if (!assoGroupExists(assoGroup))
    throw boom.badRequest('Invalid association group.')

  // Delete other year groups roles and add the new one
  const guild = getGuild()
  const user = await getGuildMember(req.user.id)
  const roleToAdd = guild.roles.find(aRole => removeAccents(aRole.name).toLowerCase() === removeAccents(assoGroup).toLowerCase())
  if (!roleToAdd) throw boom.notFound('The new role to add does not exist on the Discord server. No roles were removed from the user.')
  const rolesToDelete = user.roles.filter(aRole => !!defaultAssoGroupsName.find(aAssoGroup => aAssoGroup === removeAccents(aRole.name).toLowerCase()))
  await user.removeRoles(rolesToDelete)
  await user.addRole(roleToAdd)

  res.json({
    data: {
      addedRole: roleToAdd.name,
      deletedRoles: rolesToDelete.map(x => x.name),
      rolesList: user.roles.map(x => x.name)
    }
  })
}))

export default router
