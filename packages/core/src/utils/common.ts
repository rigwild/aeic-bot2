import { Message, TextChannel, GuildMember } from 'discord.js'

import { removeAccents, defaultTpGroupsName, defaultAssoGroupsName, defaultYearGroupsName } from '@aeic-bot2/common'

/**
 * Check a TP group exists. Case insensitive.
 * @param tpGroup TP group to check existance
 */
export const tpGroupExists = (tpGroup: string) => !!defaultTpGroupsName.find(aTpGroup => aTpGroup === removeAccents(tpGroup).toLowerCase())

/**
 * Check a association group exists. Case insensitive.
 * @param assoGroup Association group to check existance
 */
export const assoGroupExists = (assoGroup: string) => !!defaultAssoGroupsName.find(aAssoGroup => aAssoGroup === removeAccents(assoGroup).toLowerCase())

/**
 * Check a association group exists. Case insensitive.
 * @param yearGroup Association group to check existance
 */
export const yearGroupExists = (yearGroup: string) => !!defaultYearGroupsName.find(aYearGroup => aYearGroup === removeAccents(yearGroup).toLowerCase())

/**
 * Check a message was posted in a channel. Case insensitive.
 * @param message Received Discord message
 * @param channel Channel to check the message was sent to
 */
export const isMessageInChannel = (message: Message, channel: string) =>
  message.channel instanceof TextChannel && message.channel.name.toLowerCase() === channel.toLowerCase()

/**
 * Check a collection of roles has every needed roles. Case insensitive.
 * @param role Collection of roles to check
 * @param neededRoles Roles to check
 */
export const hasRole = async (role: GuildMember['roles'], ...neededRoles: string[]) =>
  neededRoles.every(aNeededRole =>
    role.find(aMemberRole => aMemberRole.name.toLowerCase() === aNeededRole.toLowerCase()))

/**
 * Check a message's author has roles. Case insensitive.
 * @param message Received Discord message
 * @param neededRoles Roles to check
 */
export const hasAuthorRole = async (message: Message, ...neededRoles: string[]) =>
  hasRole(await message.guild.member(message.author).roles, ...neededRoles)

/**
 * Check a message's author has one of some roles. Case insensitive.
 * @param neededRoles Received Discord message
 * @param role Roles to check
 */
export const hasAuthorRoleSome = async (message: Message, ...neededRoles: string[]) => {
  const memberRoles = await message.guild.member(message.author).roles
  return neededRoles.some(aNeededRole =>
    memberRoles.find(aMemberRole => aMemberRole.name.toLowerCase() === aNeededRole.toLowerCase()))
}

/**
 * Check if a day is during the week-end (Saturday or Sunday)
 * @param date Date to check
 * @returns Is the date during the week-end
 */
export const isWeekEnd = (date: Date = new Date()) => {
  const weekDayNumber = date.getDay()
  return [0, 6].some(x => x === weekDayNumber)
}

/**
 * Check if a day is during the week-end or friday (Friday, Saturday or Sunday)
 * @param date Date to check
 * @returns Is the date during the week-end
 */
export const isWeekEndOrFriday = (date: Date = new Date()) => {
  const weekDayNumber = date.getDay()
  return [0, 5, 6].some(x => x === weekDayNumber)
}
