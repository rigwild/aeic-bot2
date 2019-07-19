import { Message } from 'discord.js'

import { COMMAND_TRIGGER, ARG_SEPARATOR } from '../config'
import msgId from '../msgId'
import aide from './list/aide'
import ajouterDevoir from './list/ajouterDevoir'
import ajouterDevoirTd from './list/ajouterDevoirTd'
import afficherDevoir from './list/afficherDevoir'

// Inject all available commands here
export const commands = {
  aide,
  ajouterDevoir,
  ajouterDevoirTd,
  afficherDevoir
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
    // Check number of arguments is valid
    if (args.length < selectedCommand.meta.minArgs || (selectedCommand.meta.maxArgs && args.length > selectedCommand.meta.maxArgs))
      throw new Error(msgId.INVALID_COMMAND_ARGUMENT_NUMBER(usedCommand, args.length, selectedCommand.meta.minArgs, selectedCommand.meta.maxArgs))

    await selectedCommand.run(message, ...args)
  }
  catch (err) {
    message.reply(err.message)
  }
}
