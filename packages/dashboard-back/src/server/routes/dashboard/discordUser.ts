import express from 'express'
import boom from '@hapi/boom'
import { Router } from 'express-serve-static-core'

import { utilsCore } from '@aeic-bot2/core'
const { tpGroupExists, assoGroupExists, yearGroupExists } = utilsCore
import { defaultYearGroupsName, defaultAssoGroupsName, defaultTpGroupsName } from '@aeic-bot2/common'
import { GuildMember } from '@aeic-bot2/core/dist/types'

import { getGuild, getGuildMember, getDiscordUserProfile } from '../../bot'
import { asyncMiddleware, removeAccents, checkRequiredParameters } from '../../utils'

const router = express.Router() as Router

// Get a Discord user's profile
router.get(
  '/discordUser',
  asyncMiddleware(async (req, res) => res.json({ data: await getDiscordUserProfile(req.user.discordToken) }))
)

// Update a Discord user's year group
router.patch(
  '/discordUser/yearGroup',
  asyncMiddleware(async (req, res) => {
    const { yearGroup } = checkRequiredParameters(['yearGroup'], req.body)

    // Remove year group role
    if (yearGroup === 'remove') {
      const user = (await getGuildMember(req.user.id)) as GuildMember
      const rolesToDelete = user.roles.cache.filter(aRole => yearGroupExists(aRole.name))
      await user.roles.remove(rolesToDelete)
      return res.json({
        data: {
          addedRole: null,
          deletedRoles: rolesToDelete.map(x => x.name),
          rolesList: user.roles.cache.map(x => x.name)
        }
      })
    }

    // Check the year group exists
    if (!yearGroupExists(yearGroup)) throw boom.badRequest('Invalid year group.')

    // Delete other year groups roles and add the new one
    const guild = getGuild()
    const user = (await getGuildMember(req.user.id)) as GuildMember
    const roleToAdd = guild.roles.cache.find(
      aRole => removeAccents(aRole.name).toLowerCase() === removeAccents(yearGroup).toLowerCase()
    )
    if (!roleToAdd)
      throw boom.notFound(
        'The new role to add does not exist on the Discord server. No roles were removed from the user.'
      )
    const rolesToDelete = user.roles.cache.filter(
      aRole => !!defaultYearGroupsName.find(aYearGroup => aYearGroup === removeAccents(aRole.name).toLowerCase())
    )
    await user.roles.remove(rolesToDelete)
    await user.roles.add(roleToAdd)

    res.json({
      data: {
        addedRole: roleToAdd.name,
        deletedRoles: rolesToDelete.map(x => x.name),
        rolesList: user.roles.cache.map(x => x.name)
      }
    })
  })
)

// Update a Discord user's TP group
router.patch(
  '/discordUser/tpGroup',
  asyncMiddleware(async (req, res) => {
    const { tpGroup } = checkRequiredParameters(['tpGroup'], req.body)

    // Remove TP group role
    if (tpGroup === 'remove') {
      const user = (await getGuildMember(req.user.id)) as GuildMember
      const rolesToDelete = user.roles.cache.filter(aRole => tpGroupExists(aRole.name))
      await user.roles.remove(rolesToDelete)
      return res.json({
        data: {
          addedRole: null,
          deletedRoles: rolesToDelete.map(x => x.name),
          rolesList: user.roles.cache.map(x => x.name)
        }
      })
    }

    // Check the year group exists
    if (!tpGroupExists(tpGroup)) throw boom.badRequest('Invalid TP group.')

    // Delete other TP groups roles and add the new one
    const guild = getGuild()
    const user = (await getGuildMember(req.user.id)) as GuildMember
    const roleToAdd = guild.roles.cache.find(
      aRole => removeAccents(aRole.name).toLowerCase() === removeAccents(tpGroup).toLowerCase()
    )
    if (!roleToAdd)
      throw boom.notFound(
        'The new role to add does not exist on the Discord server. No roles were removed from the user.'
      )
    const rolesToDelete = user.roles.cache.filter(
      aRole => !!defaultTpGroupsName.find(aTpGroup => aTpGroup === removeAccents(aRole.name).toLowerCase())
    )
    await user.roles.remove(rolesToDelete)
    await user.roles.add(roleToAdd)

    res.json({
      data: {
        addedRole: roleToAdd.name,
        deletedRoles: rolesToDelete.map(x => x.name),
        rolesList: user.roles.cache.map(x => x.name)
      }
    })
  })
)

// Update a Discord user's association group
router.patch(
  '/discordUser/assoGroup',
  asyncMiddleware(async (req, res) => {
    const { assoGroup } = checkRequiredParameters(['assoGroup'], req.body)

    // Remove student association group role
    if (assoGroup === 'remove') {
      const user = (await getGuildMember(req.user.id)) as GuildMember
      const rolesToDelete = user.roles.cache.filter(aRole => assoGroupExists(aRole.name))
      await user.roles.remove(rolesToDelete)
      return res.json({
        data: {
          addedRole: null,
          deletedRoles: rolesToDelete.map(x => x.name),
          rolesList: user.roles.cache.map(x => x.name)
        }
      })
    }

    // Check the asso group exists
    if (!assoGroupExists(assoGroup)) throw boom.badRequest('Invalid association group.')

    // Delete other year groups roles and add the new one
    const guild = getGuild()
    const user = (await getGuildMember(req.user.id)) as GuildMember
    const roleToAdd = guild.roles.cache.find(
      aRole => removeAccents(aRole.name).toLowerCase() === removeAccents(assoGroup).toLowerCase()
    )
    if (!roleToAdd)
      throw boom.notFound(
        'The new role to add does not exist on the Discord server. No roles were removed from the user.'
      )
    const rolesToDelete = user.roles.cache.filter(
      aRole => !!defaultAssoGroupsName.find(aAssoGroup => aAssoGroup === removeAccents(aRole.name).toLowerCase())
    )
    await user.roles.remove(rolesToDelete)
    await user.roles.add(roleToAdd)

    res.json({
      data: {
        addedRole: roleToAdd.name,
        deletedRoles: rolesToDelete.map(x => x.name),
        rolesList: user.roles.cache.map(x => x.name)
      }
    })
  })
)

export default router
