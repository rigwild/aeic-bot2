import { Message, TextChannel } from 'discord.js'

import { TpGroupModel } from '../database/TpGroup'

/**
 * Check a TP group exists. Case insensitive.
 * @param tpGroup TP group to check existance
 */
export const tpGroupExists = async (tpGroup: string) => !!(await TpGroupModel.findOne({ name: tpGroup.toLowerCase() }))

/**
 * Check a message was posted in a channel. Case insensitive.
 * @param message Received Discord message
 * @param channel Channel to check the message was sent to
 */
export const isMessageInChannel = (message: Message, channel: string) =>
  message.channel instanceof TextChannel && message.channel.name === channel

/**
 * Check a message's author has a role. Case insensitive.
 * @param message Received Discord message
 * @param role Role to find
 */
export const hasAuthorRole = async (message: Message, role: string) =>
  !!message.guild.member(message.author).roles.find(aRole => aRole.name.toLowerCase() === role.toLowerCase())

/**
 * Transform a date object to a human-readable format
 * @param date Date to format
 */
export const toHumanDate = (date: Date) => date.toLocaleDateString('fr-FR')
