import express from 'express'
import boom from '@hapi/boom'

import { tpGroupExists, assoGroupExists, yearGroupExists, planningIutLoader, hasRole, ExoPlatformLoader } from '@aeic-bot2/bot/src/commands/utils'
import { defaultYearGroupsName, defaultAssoGroupsName, defaultTpGroupsName } from '@aeic-bot2/bot/src/database/initDb'
import { TpGroupModel, TpGroupDocument, Homework } from '@aeic-bot2/bot/src/database/TpGroup'

import { getGuild, getGuildMember } from '../bot'
import { asyncMiddleware, removeAccents, checkRequiredParameters } from '../utils'
import { PLANNING_LINK } from '../../config'
import { getDiscordUserProfile, extractMemberProfile } from './_utils'

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

// Get the list of homework for a TP group
router.get('/tpGroup/:tpGroup/homework', asyncMiddleware(async (req, res) => {
  const { tpGroup } = checkRequiredParameters(['tpGroup'], req.params)

  // Check the tp group exists
  if (!tpGroupExists(tpGroup))
    throw boom.badRequest('Invalid TP group.')

  // Get Discord Guild member data
  const user = await getGuildMember(req.user.id)

  // Check the member has the TP group role
  if (!(await hasRole(user.roles, tpGroup)))
    throw boom.forbidden('You need the TP group role to see this TP homework.')

  let data = await TpGroupModel.findOne({ name: removeAccents(tpGroup).toLowerCase() }, 'name yearGroup tdGroup homework')
  if (!data) {
    console.error('Could not find a TP group', data)
    throw boom.notFound('The TP group was not found.')
  }

  // Resolve homework authors Discord profiles
  const homework = data.homework.toObject()
  let homeworkResolvedAuthors = []
  for (const anHomework of homework) {
    const member = await getGuildMember(anHomework.authorId)
    if (!member) return
    homeworkResolvedAuthors.push({
      ...anHomework,
      author: extractMemberProfile(member)
    })
  }

  res.json({
    data: homeworkResolvedAuthors
  })
}))

// Add an homework to a TP group
router.put('/tpGroup/:tpGroup/homework', asyncMiddleware(async (req, res) => {
  const { tpGroup } = checkRequiredParameters(['tpGroup'], req.params)
  const { homework: homeworkToAdd } = checkRequiredParameters<Homework>(['homework'], req.body)

  // Check the tp group exists
  if (!tpGroupExists(tpGroup))
    throw boom.badRequest('Invalid TP group.')

  // Check the dueDate is a valid date
  const parsedDueDate = Date.parse(homeworkToAdd.dueDate.toString())
  if (isNaN(parsedDueDate)) throw new Error('Invalid due date.')
  if (parsedDueDate < Date.now())
    throw boom.badRequest('The due date can not be in the past.')

  // Get Discord Guild member data
  const user = await getGuildMember(req.user.id)

  // Check the member has the TP group role
  if (!(await hasRole(user.roles, tpGroup)))
    throw boom.forbidden('You need the TP group role to see this TP homework.')

  // Delete the homework
  let data = <TpGroupDocument>await TpGroupModel.findOneAndUpdate({ name: tpGroup }, {
    $push: {
      homework: homeworkToAdd
    }
  }, { new: true })
  if (!data) {
    console.error('Could not add an homework', data)
    throw boom.notFound('The homework was not added.')
  }

  // Resolve homework authors Discord profiles
  const homework = data.homework.toObject()
  let homeworkResolvedAuthors = []
  for (const anHomework of homework) {
    const member = await getGuildMember(anHomework.authorId)
    if (!member) return
    homeworkResolvedAuthors.push({
      ...anHomework,
      author: extractMemberProfile(member)
    })
  }

  res.json({
    data: homeworkResolvedAuthors
  })
}))


// Delete an homework based on its ID
router.delete('/tpGroup/:tpGroup/homework/:homeworkId', asyncMiddleware(async (req, res) => {
  const { tpGroup, homeworkId } = checkRequiredParameters(['tpGroup', 'homeworkId'], req.params)

  // Check the tp group exists
  if (!tpGroupExists(tpGroup))
    throw boom.badRequest('Invalid TP group.')

  // Check the homework exists in the TP
  if (!(await TpGroupModel.exists({ name: tpGroup, 'homework._id': homeworkId })))
    throw boom.notFound('The homework was not found in the provided TP.')

  // Get Discord Guild member data
  const user = await getGuildMember(req.user.id)

  // Check the member has the TP group role
  if (!(await hasRole(user.roles, tpGroup)))
    throw boom.forbidden('You need the TP group role to edit this TP homework.')

  // Delete the homework
  const data = <TpGroupDocument>await TpGroupModel.findOneAndUpdate({ name: tpGroup, 'homework._id': homeworkId }, {
    $pull: {
      homework: {
        _id: homeworkId
      }
    }
  }, { new: true })
  if (!data) {
    console.error('Could not delete an homework', data)
    throw boom.notFound('The homework was not deleted.')
  }

  // Resolve homework authors Discord profiles
  const homework = data.homework.toObject()
  let homeworkResolvedAuthors = []
  for (const anHomework of homework) {
    const member = await getGuildMember(anHomework.authorId)
    if (!member) return
    homeworkResolvedAuthors.push({
      ...anHomework,
      author: extractMemberProfile(member)
    })
  }

  res.json({
    data: homeworkResolvedAuthors
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
    .map(x => ({ ...x, screenPath: `${PLANNING_LINK}${x.screenPath}` }))
  res.json({
    data: planning
  })
}))

// Find someone on eXo Platform
router.get('/eXoPlatform/:search', asyncMiddleware(async (req, res) => {
  const { search } = checkRequiredParameters(['search'], req.params)
  res.json({
    data: await ExoPlatformLoader.searchUser(search)
  })
}))

export default router
