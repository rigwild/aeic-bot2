import { msgId, config } from '@aeic-bot2/core'
const { COMMAND_TRIGGER, ARG_SEPARATOR } = config

import { DiscordMessageForcedTextChannel } from './types'

import afficherDevoir from './list/afficherDevoir'
import afficherPlanning from './list/afficherPlanning'
import aide from './list/aide'
import ajouterDevoir from './list/ajouterDevoir'
import choisirGroupeAnnee from './list/choisirGroupeAnnee'
import choisirGroupeAsso from './list/choisirGroupeAsso'
import choisirGroupeTp from './list/choisirGroupeTp'
import trouverPersonne from './list/trouverPersonne'
import zAdminRolePrune from './list/zAdminRolePrune'
import listerPlanning from './list/listerPlanning'

// Inject all available commands here
export const commands = {
  afficherDevoir,
  afficherPlanning,
  aide,
  ajouterDevoir,
  choisirGroupeAnnee,
  choisirGroupeAsso,
  choisirGroupeTp,
  trouverPersonne,
  zAdminRolePrune,
  listerPlanning
}

// Make all commands keys lowercase
const commandsLowered = Object.fromEntries(Object.entries(commands).map(([k, v]) => [k.toLowerCase(), v]))

export default async (message: DiscordMessageForcedTextChannel) => {
  try {
    // Remove the command trigger and trim (phone auto-space between command trigger and command)
    const msg = message.content.substring(COMMAND_TRIGGER.length).trim()
    // Check command exists
    const usedCommand = msg.replace(/\s.*/, '')
    // Ignore if command does not contain any letters
    if (!usedCommand.match(/[a-zA-Z]/)) return

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
    console.error(error)
    await message.reply(error.message)
  }
}
