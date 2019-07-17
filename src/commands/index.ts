import { COMMAND_TRIGGER } from '../config'
import msgId from '../msgId'

import aide from './aide'
import test from './test'
import { Message } from 'discord.js'

// Inject all available commands here
export const commands = {
  aide,
  test
}

// Make all commands keys lowercase
const commandsLowered = Object.fromEntries(Object.entries(commands).map(([k, v]) => [k.toLowerCase(), v]))

export default (message: Message) => {
  // Remove the command trigger
  const msg = message.content.substring(COMMAND_TRIGGER.length)
  // Check command exists
  const usedCommand = msg.replace(/\s.*/, '')
  const usedCommandLowered = usedCommand.toLowerCase()
  if (!commandsLowered[usedCommandLowered]) throw new Error(msgId.UNKNOWN_COMMAND(usedCommand))

  const selectedCommand = commandsLowered[usedCommandLowered]
  // Remove the command
  const argsStr = msg.substring(usedCommand.length).trim()
  // Extract arguments separated by ` -- `
  const args = argsStr ? argsStr.split(' -- ') : []
  // Check number of arguments is valid
  if (args.length < selectedCommand.meta.minArgs || (selectedCommand.meta.maxArgs && args.length > selectedCommand.meta.maxArgs))
    throw new Error(msgId.INVALID_COMMAND_ARGUMENT_NUMBER(usedCommand, args.length, selectedCommand.meta.minArgs, selectedCommand.meta.maxArgs))

  selectedCommand.run(message, ...args)
}
