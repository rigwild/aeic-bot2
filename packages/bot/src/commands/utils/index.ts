import { Message, TextChannel, Role, GuildMember } from 'discord.js'

import { defaultTpGroupsName, defaultAssoGroupsName, defaultYearGroupsName } from '../../database/initDb'
import planningIutLoader from './PlanningIutLoader'
import ExoPlatformLoader from './ExoPlatformLoader'

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
  hasRole(await message.guild.member(message.author).roles)

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
 * Transform a date object to a human-readable format
 * @param date Date to format
 */
export const toHumanDate = (date: Date) => date.toLocaleDateString('fr-FR')

/**
 * Transform a date object to a human-readable format
 * @param date Date to format
 */
export const toHumanDateTime = (date: Date) => date.toLocaleString('fr-FR')

/**
 * Get a date's week number
 * @param date Date to parse
 * @see https://stackoverflow.com/a/34323944
 */
export const getDateWeek = (_date: Date) => {
  const date = new Date(_date)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
  const week1 = new Date(date.getFullYear(), 0, 4)
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
}

/**
 * Remove accents from a string
 * @param str String to format
 */
export const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export { planningIutLoader, ExoPlatformLoader }
