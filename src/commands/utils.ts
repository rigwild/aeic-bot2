import { Message, TextChannel } from 'discord.js'

import { defaultTpGroupsName, defaultAssoGroupsName } from '../database/initDb'

/**
 * Check a TP group exists. Case insensitive.
 * @param tpGroup TP group to check existance
 */
export const tpGroupExists = (tpGroup: string) => !!defaultTpGroupsName.find(aTpGroup => aTpGroup === tpGroup.toLowerCase())

/**
 * Check a association group exists. Case insensitive.
 * @param assoGroup Association group to check existance
 */
export const assoGroupExists = (assoGroup: string) => !!defaultAssoGroupsName.find(aAssoGroup => aAssoGroup === assoGroup.toLowerCase())

/**
 * Check a message was posted in a channel. Case insensitive.
 * @param message Received Discord message
 * @param channel Channel to check the message was sent to
 */
export const isMessageInChannel = (message: Message, channel: string) =>
  message.channel instanceof TextChannel && message.channel.name.toLowerCase() === channel.toLowerCase()

/**
 * Check a message's author has roles. Case insensitive.
 * @param message Received Discord message
 * @param role Roles to check
 */
export const hasAuthorRole = async (message: Message, ...neededRoles: string[]) => {
  const memberRoles = await message.guild.member(message.author).roles
  return neededRoles.every(aNeededRole =>
    memberRoles.find(aMemberRole => aMemberRole.name.toLowerCase() === aNeededRole.toLowerCase()))
}

/**
 * Check a message's author has one of some roles. Case insensitive.
 * @param message Received Discord message
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
export const toHumanDate = (date?: Date) => date && date.toLocaleDateString('fr-FR')
