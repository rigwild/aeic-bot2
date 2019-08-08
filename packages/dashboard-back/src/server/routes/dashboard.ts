import express from 'express'
import boom from '@hapi/boom'
import { tpGroupExists, assoGroupExists } from '@aeic-bot2/bot/src/commands/utils'
import { defaultYearGroupsName, defaultAssoGroupsName } from '@aeic-bot2/bot/src/database/initDb'

import { getGuild, getUser } from '../bot'
import { asyncMiddleware, removeAccents, checkRequiredParameters } from '../utils'

const router = express.Router()

router.post('/yearGroup', asyncMiddleware(async (req, res) => {
  const { yearGroup } = checkRequiredParameters(['yearGroup'], req.body)

  // Check the year group exists
  if (!tpGroupExists(yearGroup))
    throw boom.badRequest('Invalid year group.')

  // Delete other year groups roles and add the new one
  const guild = getGuild()
  const user = await getUser(req.user.id)
  const rolesToDelete = user.roles.filter(aRole => !!defaultYearGroupsName.find(aYearGroup => aYearGroup === removeAccents(aRole.name).toLowerCase()))
  const roleToAdd = guild.roles.find(aRole => removeAccents(aRole.name).toLowerCase() === removeAccents(yearGroup).toLowerCase())
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

router.post('/assoGroup', asyncMiddleware(async (req, res) => {
  const { assoGroup } = checkRequiredParameters(['assoGroup'], req.body)

  // Check the year group exists
  // Check the asso group exists
  if (!assoGroupExists(assoGroup))
    throw boom.badRequest('Invalid association group.')

  // Delete other year groups roles and add the new one
  const guild = getGuild()
  const user = await getUser(req.user.id)
  const rolesToDelete = user.roles.filter(aRole => !!defaultAssoGroupsName.find(aAssoGroup => aAssoGroup === removeAccents(aRole.name).toLowerCase()))
  const roleToAdd = guild.roles.find(aRole => removeAccents(aRole.name).toLowerCase() === removeAccents(assoGroup).toLowerCase())
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
