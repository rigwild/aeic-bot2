import express from 'express'
import boom from '@hapi/boom'

import { getGuild, getUser } from '../bot'
import { asyncMiddleware, removeAccents } from '../utils'

const router = express.Router()

router.post('/yearGroup', asyncMiddleware(async (req, res) => {
  if (!req.body.yearGroup) throw boom.badRequest('Missing parameter')

  const yearGroup = req.body.yearGroup
  const yearGroups = [
    '1ère année',
    '2ème année FI',
    '2ème année APP'
  ].map(x => removeAccents(x).toLowerCase())

  // Check the year group exists
  if (!yearGroups.includes(removeAccents(yearGroup).toLowerCase()))
    throw boom.badRequest('Invalid parameter')

  // Delete other year groups roles and add the new one
  const guild = getGuild()
  const user = await getUser(req.user.id)
  const rolesToDelete = user.roles.filter(aRole => !!yearGroups.find(aYearGroup => removeAccents(aYearGroup).toLowerCase() === removeAccents(aRole.name).toLowerCase()))
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
  if (!req.body.assoGroup) throw boom.badRequest('Missing parameter')

  const assoGroup = req.body.assoGroup
  const assoGroups = ['omega', 'sigma', 'theta', 'delta'].map(x => removeAccents(x).toLowerCase())

  // Check the year group exists
  if (!assoGroups.includes(removeAccents(assoGroup).toLowerCase()))
    throw boom.badRequest('Invalid parameter')

  // Delete other year groups roles and add the new one
  const guild = getGuild()
  const user = await getUser(req.user.id)
  const rolesToDelete = user.roles.filter(aRole => !!assoGroups.find(aAssoGroup => removeAccents(aAssoGroup).toLowerCase() === removeAccents(aRole.name).toLowerCase()))
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
