import Discord from 'discord.js'

import { DISCORD_AUTH_TOKEN, COMMAND_TRIGGER, DISCORD_SERVER_ID, logger } from './config'
import msgId from './msgId'
import { commandLoader } from './commands'

// Create the bot instance
export const bot = new Discord.Client()

/** Start the bot */
export const start = () => new Promise(resolve => {
  logger.info('Starting AEIC-BOT...')

  bot.login(DISCORD_AUTH_TOKEN)

  bot.on('ready', () => {
    const serverInfo = bot.guilds.find(x => x.id === DISCORD_SERVER_ID)
    if (!serverInfo) throw new Error(`The server ID=${DISCORD_SERVER_ID} was not found. Check the bot has access to it.`)
    logger.info(`Bot connected on the server "${serverInfo.name}" ID=${DISCORD_SERVER_ID}.`)
    resolve()
  })

  // Check if new message contained a command, then execute it
  bot.on('message', message => {
    if (message.guild.id !== DISCORD_SERVER_ID || !message.content.trim().startsWith(COMMAND_TRIGGER)) return
    return commandLoader(message)
  })

  // Send a message when a member joins the server
  bot.on('guildMemberAdd', async member => {
    if (member.guild.id !== DISCORD_SERVER_ID) return
    try {
      await member.send(msgId.WELCOME_DM)
      await member.guild.defaultChannel.send(msgId.WELCOME_PUBLIC(member.id))
    }
    catch (error) {
      logger.error(error)
    }
  })
})
