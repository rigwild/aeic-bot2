import express from 'express'
import boom from '@hapi/boom'

import { tpGroupExists, assoGroupExists, yearGroupExists, planningIutLoader, hasRole } from '@aeic-bot2/bot/src/commands/utils'
import { defaultYearGroupsName, defaultAssoGroupsName, defaultTpGroupsName } from '@aeic-bot2/bot/src/database/initDb'
import { TpGroupModel, TpGroupDocument } from '@aeic-bot2/bot/src/database/TpGroup'

import { getGuild, getUser } from '../bot'
import { asyncMiddleware, removeAccents, checkRequiredParameters } from '../utils'
import { PLANNING_LINK } from '../../config'

const router = express.Router()

// Update a Discord user's year group
router.patch('/discordUser/yearGroup', asyncMiddleware(async (req, res) => {
  const { yearGroup } = checkRequiredParameters(['yearGroup'], req.body)

  // Check the year group exists
  if (!yearGroupExists(yearGroup))
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

// Update a Discord user's TP group
router.patch('/discordUser/tpGroup', asyncMiddleware(async (req, res) => {
  const { tpGroup } = checkRequiredParameters(['tpGroup'], req.body)

  // Check the year group exists
  if (!tpGroupExists(tpGroup))
    throw boom.badRequest('Invalid TP group.')

  // Delete other TP groups roles and add the new one
  const guild = getGuild()
  const user = await getUser(req.user.id)
  const rolesToDelete = user.roles.filter(aRole => !!defaultTpGroupsName.find(aTpGroup => aTpGroup === removeAccents(aRole.name).toLowerCase()))
  const roleToAdd = guild.roles.find(aRole => removeAccents(aRole.name).toLowerCase() === removeAccents(tpGroup).toLowerCase())
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

// Get the list of homeworks for a TP group
router.get('/tpGroup/:tpGroup/homework', asyncMiddleware(async (req, res) => {
  const { tpGroup } = checkRequiredParameters(['tpGroup'], req.params)

  // Check the tp group exists
  if (!tpGroupExists(tpGroup))
    throw boom.badRequest('Invalid TP group.')

  // Get Discord Guild member data
  const user = await getUser(req.user.id)

  // Check the member has the TP group role
  if (!(await hasRole(user.roles, tpGroup)))
    throw boom.forbidden('You need the TP group role to see this TP homeworks.')

  const data = await TpGroupModel.find({ name: removeAccents(tpGroup).toLowerCase() }, 'name yearGroup tdGroup homework')
  res.json({
    data
  })
}))


// Delete an homework based on its ID
router.delete('/tpGroup/:tpGroup/homework/:homeworkId', asyncMiddleware(async (req, res) => {
  const { tpGroup, homeworkId } = checkRequiredParameters(['tpGroup', 'homeworkId'], req.params)

  // Check the tp group exists
  if (!tpGroupExists(tpGroup))
    throw boom.badRequest('Invalid TP group.')

  // Check the homework exists in the TP
  if (!(await TpGroupModel.exists({ name: tpGroup, 'homework.id': homeworkId })))
    throw boom.notFound('The homework was not found in the provided TP.')

  // Get Discord Guild member data
  const user = await getUser(req.user.id)

  // Check the member has the TP group role
  if (!(await hasRole(user.roles, tpGroup)))
    throw boom.forbidden('You need the TP group role to see this TP homeworks.')

  // Delete the homework
  const data = <TpGroupDocument>await TpGroupModel.findOneAndUpdate({ name: tpGroup, 'homework.id': homeworkId }, {
    $pull: {
      homework: {
        _id: homeworkId
      }
    }
  })
  if (!data) {
    console.error('Could not delete an homework', data)
    throw boom.notFound('The homework was not delete.')
  }
  res.json({
    data: {
      success: true
    }
  })
}))

// Get the planning of a TP group
router.get('/tpGroup/:tpGroup/planning', asyncMiddleware(async (req, res) => {
  const { tpGroup } = checkRequiredParameters(['tpGroup'], req.params)

  // Check the tp group exists
  if (!tpGroupExists(tpGroup))
    throw boom.badRequest('Invalid TP group.')

  const { planningGroup } = <TpGroupDocument>(await TpGroupModel.findOne({ name: removeAccents(tpGroup).toLowerCase() }, 'planningGroup'))
  if (!planningGroup) throw boom.internal('The TP group exists but it does not have a planning group.')

  const planning = (await planningIutLoader.getGroup(planningGroup))
    .map(x => ((x.screenPath = `${PLANNING_LINK}${x.screenPath}`), x))
  res.json({
    data: {
      planning,
      tpGroup
    }
  })
}))

export default router
