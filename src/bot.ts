import Discord from 'discord.js'

import { DISCORD_AUTH_TOKEN, COMMAND_TRIGGER, SERVER_ID, logger } from './config'
import msgId from './msgId'
import runCommand from './commands'

// Create the bot instance
export const bot = new Discord.Client()

/** Start the bot */
export const start = () => new Promise(resolve => {
  logger.info('Starting AEIC-BOT...')

  bot.login(DISCORD_AUTH_TOKEN)

  bot.on('ready', () => {
    const serverInfo = bot.guilds.find(x => x.id === SERVER_ID)
    if (!serverInfo) throw new Error(`The server ID=${SERVER_ID} was not found. Check the bot has access to it.`)
    logger.info(`Bot connected on the server "${serverInfo.name}" ID=${SERVER_ID}.`)
    resolve()
  })

  // Check if new message contained a command, then execute it
  bot.on('message', message => {
    if (message.guild.id !== SERVER_ID || !message.content.trim().startsWith(COMMAND_TRIGGER)) return
    return runCommand(message)
  })

  // Send a message when a member joins the server
  bot.on('guildMemberAdd', async member => {
    if (member.guild.id !== SERVER_ID) return
    try {
      await member.send(msgId.WELCOME_DM)
      await member.guild.defaultChannel.send(msgId.WELCOME_PUBLIC(member.id))
    }
    catch (error) {
      logger.error(error.message)
    }
  })
})
