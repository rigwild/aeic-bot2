import { Message } from 'discord.js'

import { COMMAND_TRIGGER, ARG_SEPARATOR, logger } from '../config'
import msgId from '../msgId'

import aide from './list/aide'
import ajouterDevoir from './list/ajouterDevoir'
import ajouterDevoirTd from './list/ajouterDevoirTd'
import afficherDevoir from './list/afficherDevoir'
import choisirGroupeTp from './list/choisirGroupeTp'
import choisirGroupeAsso from './list/choisirGroupeAsso'
import afficherPlanning from './list/afficherPlanning'
import trouverPersonne from './list/trouverPersonne'

// Inject all available commands here
export const commands = {
  aide,
  ajouterDevoir,
  ajouterDevoirTd,
  afficherDevoir,
  choisirGroupeTp,
  choisirGroupeAsso,
  afficherPlanning,
  trouverPersonne
}

// Make all commands keys lowercase
const commandsLowered = Object.fromEntries(Object.entries(commands).map(([k, v]) => [k.toLowerCase(), v]))

export default async (message: Message) => {
  try {
    // Remove the command trigger
    const msg = message.content.substring(COMMAND_TRIGGER.length)
    // Check command exists
    const usedCommand = msg.replace(/\s.*/, '')
    const usedCommandLowered = usedCommand.toLowerCase()
    if (!commandsLowered[usedCommandLowered]) throw new Error(msgId.UNKNOWN_COMMAND(usedCommand))

    const selectedCommand = commandsLowered[usedCommandLowered]
    // Remove the command from string
    const argsStr = msg.substring(usedCommand.length).trim()
    // Extract arguments separated by `--` and trim each of it
    const args = (argsStr ? argsStr.split(ARG_SEPARATOR) : []).map(x => x.trim())

    const toThrow = msgId.INVALID_COMMAND_ARGUMENT_NUMBER(usedCommand, args.length, selectedCommand.meta.minArgs, selectedCommand.meta.maxArgs)
    // Check number of arguments is valid
    if (args.length < selectedCommand.meta.minArgs || (typeof selectedCommand.meta.maxArgs === 'number' && args.length > selectedCommand.meta.maxArgs))
      throw new Error(toThrow)

    await selectedCommand.run(message, ...args)
  }
  catch (error) {
    logger.error(error)
    await message.reply(error.message)
  }
}
